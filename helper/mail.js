//this is helper function for reseting user password
const nodemailer = require('nodemailer');
let dotenv = require('dotenv');
dotenv.config();
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports.sendEmail = async function (email,password){
    try{
        let info  = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your password has been reset.Check your new password in mail below',
            text:`Your new password is ${password}. Thank you for using our service.`
        });
    }catch(err){
        console.log(err);
        
        
    }

}

