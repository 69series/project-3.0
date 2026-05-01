const nodemailer = require('nodemailer');

const otpStore = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email) {
    const otp = generateOTP();
    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000
    };

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS,
        }
    });

    await transporter.sendMail({
        from: process.env.BREVO_USER,
        to: email,
        subject: 'Your OTP - 69s-project-3.0',
        text: `Your OTP is: ${otp}. It expires in 5 minutes.
Resentment is corrosive and I hate it -TS.
When You come from NOTHING, You appreciate EVERYTHING -69s`
    });

    console.log(`OTP sent to ${email}`);
}

function verifyOTP(email, otp) {
    const record = otpStore[email];
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
        delete otpStore[email];
        return false;
    }
    if (record.otp !== otp) return false;
    delete otpStore[email];
    return true;
}

module.exports = { sendOTP, verifyOTP };