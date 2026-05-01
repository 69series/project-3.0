require('dotenv').config();
const path = require('path')
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const { sendOTP, verifyOTP } = require('./auth/emailOTP');
const User = require('./models/user');
const bcrypt = require('bcrypt');
require('./auth/google');

connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// ─── JWT Middleware ──────────────────────────────────────
function verifyJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// ─── Google OAuth ────────────────────────────────────────
app.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  prompt: 'select_account',
  session: false
}));

app.get('/69s/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, displayName: req.user.displayName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Redirect to React frontend with token in URL
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

app.get('/auth/failure', (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}?error=google_failed`);
});

// ─── Get current user ────────────────────────────────────
app.get('/me', verifyJWT, (req, res) => {
  res.json({
    displayName: req.user.displayName,
    email: req.user.email,
  });
});

// ─── Logout (frontend just deletes the token) ────────────
app.get('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// ─── Email Signup - Step 1: Send OTP ─────────────────────
app.post('/signup/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.isVerified)
    return res.status(400).json({ message: 'Email already registered' });

  try {
    await sendOTP(email);
    res.json({ message: 'OTP sent to your email!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// ─── Email Signup - Step 2: Verify OTP + Set Password ────
app.post('/signup/verify-otp', async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password)
    return res.status(400).json({ message: 'All fields required' });

  const isValid = verifyOTP(email, otp);
  if (!isValid) return res.status(400).json({ message: 'Invalid or expired OTP' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      displayName: email.split('@')[0],
      isVerified: true,
    });
    console.log('New user created!', user);
    res.json({ message: 'Signup successful! Please sign in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// ─── Email Signin ─────────────────────────────────────────
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'All fields required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });
  if (!user.isVerified) return res.status(400).json({ message: 'Email not verified' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

  const token = jwt.sign(
    { id: user._id, email: user.email, displayName: user.displayName },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ message: `Welcome back ${user.displayName}!`, token });
});

app.get('/resume', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"')
  res.sendFile(path.join(__dirname, 'resume.pdf'))
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`server on http://localhost:${process.env.PORT || 8080}`);
});