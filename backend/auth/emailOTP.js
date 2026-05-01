require('dotenv').config();
const { Resend } = require('resend');

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

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your OTP - 69s-project-3.0',
        text: `Your OTP is: ${otp}. It expires in 5 minutes.`
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