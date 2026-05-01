const nodemailer = require('nodemailer');
const https = require('https');

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

    const data = JSON.stringify({
        sender: { email: process.env.BREVO_USER },
        to: [{ email: email }],
        subject: 'Your OTP - 69s-project-3.0',
        textContent: `Your OTP is: ${otp}. It expires in 5 minutes.`
    });

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
        },
        body: data
    });

    const result = await response.json();
    console.log('Brevo response:', JSON.stringify(result));

    if (!response.ok) {
        throw new Error(`Brevo error: ${JSON.stringify(result)}`);
    }

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