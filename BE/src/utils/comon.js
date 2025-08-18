const twilio = require('twilio')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { MailtrapTransport } = require("mailtrap");

const https = require('https');
const axios = require('axios');
const ACCESS_TOKEN = process.env.SMS_API_KEY;

const validateUserName = (userName) => {
    let type;
    if (validatePhoneNumber(userName)) {
        type = 'phone';
    } else if (validateEmail(userName)) {
        type = 'email';
    } else {
        type = 'unknown';
    }
    return type;
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?\d{9,15}$/;
    return phoneRegex.test(phone);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const createToken = (user) => {
    console.log('Creating token for user:', user);

    const payload = {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

//twilio
const sendOTP = async (to, otp) => {
    const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    if (to.startsWith('0')) {
        to = '+84' + to.slice(1);
    }
    console.log(to, otp);
    try {
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });
        console.log(message);
    }
    catch (error) {
        console.error('Error sending OTP:', error);
    }

};

//speedsms
const sendSMS = (phones, content, type, sender) => {
    console.log(phones, content, type, sender);

    var url = 'api.speedsms.vn';
    var params = JSON.stringify({
        to: phones,
        content: content,
        sms_type: 2,
        // sender: ""
    });

    var buf = new Buffer(ACCESS_TOKEN + ':x');
    var auth = "Basic " + buf.toString('base64');
    const options = {
        hostname: url,
        port: 443,
        path: '/index.php/sms/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        }
    };

    const req = https.request(options, function (res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (d) {
            body += d;
        });
        res.on('end', function () {
            var json = JSON.parse(body);
            if (json.status == 'success') {
                console.log("send sms success")
            }
            else {
                console.log("send sms failed " + body);
            }
        });
    });

    req.on('error', function (e) {
        console.log("send sms failed: " + e);
    });

    req.write(params);
    req.end();
}

//esms
const sendESMS = async (phones, otp) => {
    const APIKey = process.env.ESMS_API_KEY;
    const SecretKey = process.env.ESMS_SECRET_KEY;
    const smsContent = `Ma OTP cua ban la: ${otp}. Hieu luc trong 5 phut.`;
    console.log(`Sending OTP to ${phones}: ${otp}`);

    try {
        const url = `https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?`

        const payload = {
            ApiKey: APIKey,
            SecretKey: SecretKey,
            // Phone: '0785922236',
            Phone: phones,
            Content: smsContent,
            SmsType: 8
        }

        const { data } = await axios.get(url, { params: payload });
        console.log(data);
        if (data.CodeResult == 100) {
            console.log('OTP sent successfully!', data);
        } else {
            console.error('Error sending OTP:', data.ErrorMessage);
        }
    } catch (error) {
        console.error('Request failed:', error.message);
    }
}

const sendEmail = async (to, subject, content) => {
    // const TOKEN = "f2c44a9ca1ed971f36bc5e5871601db4";
    const TOKEN = process.env.MAIL_TRAP_TOKEN;

    const transport = nodemailer.createTransport(
        MailtrapTransport({
            token: TOKEN,
        })
    );

    const sender = {
        address: "hello@demomailtrap.co",
        name: "Classroom management",
    };

    const recipients = [
        to,
    ];

    transport
        .sendMail({
            from: sender,
            to: recipients,
            subject: subject,
            text: content,
            category: "Integration Test",
        })
        .then(console.log, console.error);
};

const createResetPasswordToken = ({ id, name, email, phone }) => {
    const token = jwt.sign(
        { id, name, email, phone, resetPassword: true },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    return token;
};

module.exports = {
    validateUserName,
    validatePhoneNumber,
    validateEmail,
    sendOTP,
    sendSMS,
    generateOTP,
    createToken,
    sendESMS,
    sendEmail,
    createResetPasswordToken
};
