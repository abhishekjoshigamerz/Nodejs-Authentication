const nodemailer = require('nodemailer');

module.exports.sendMail = async function (email,password){
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '********',
        pass: '****'
    }

});
let details = {
    from: '****',
    to: email,
    subject: 'Your password has been reset.Check your new password in mail below',
    text:`Your new password is ${password}. Thank you for using our service.`
}

await mailTransporter.sendMail(details,function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log('Email sent successfully');
    }
});

}