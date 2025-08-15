const twilio = require('twilio')
const jwt = require('jsonwebtoken');

var https = require('https');
const ACCESS_TOKEN = process.env.SMS_API_KEY;

const validateUserName = (userName) => {
    let type;
    if (validatePhoneNumber(userName)) {
        type = 'phone'; // Đây là số điện thoại
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userName)) {
        type = 'email'; // Đây là email
    } else {
        type = 'unknown'; // Không xác định
    }
    return type;
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?\d{9,15}$/;
    return phoneRegex.test(phone);
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

module.exports = {
    validateUserName,
    validatePhoneNumber,
    sendOTP,
    sendSMS,
    generateOTP,
    createToken
};
