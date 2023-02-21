const {validationResult} = require('express-validator');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const mail = require('../../helper/mail');
const dot = require('dotenv');
const axios = require('axios');
let qs = require('qs');



dot.config();
module.exports.register = function (req,res){
    res.render('home');
}

module.exports.signIn = function (req,res){
    res.render('signin');
}

module.exports.logout = function (req,res){
    req.session.user = '';
    req.session.isLoggedIn = false;
    req.flash('success','Successfully logged out!');
    return res.redirect('/');
}

//authenticate users
module.exports.createSession = async function (req,res){
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       
        let message = [];
        let result = errors.array();
        for(let i=0;i<result.length;i++){
            message.push(result[i].msg);
        }
        // set up flash message
        req.flash('error',message);
        return res.redirect('back');    
    }

    let password = req.body.password;
    let email = req.body.email;
    let user = await User.find({email:email});
    if(user){
        let result = await bcrypt.compare(password,user[0].password);
        if(result){
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.flash('success','Logged in successfully');
            console.log(`User has logged in before: ${user[0].hasLoggedInBefore}`);
            if(user[0].hasLoggedInBefore===true){
                return res.redirect('/user/dashboard');
            }
            return res.redirect('/user/password-reset');
        }else{
            req.flash('error','Invalid email or password ');
            return res.redirect('back');
        }
    }
    return res.redirect('/user/dashboard');
}

//change password 
module.exports.changePassword = async function (req,res){
    console.log(` Old password is ${req.body.Oldpassword}`);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let message = [];
        let result = errors.array();
        for(let i=0;i<result.length;i++){
            message.push(result[i].msg);
        }
        // set up flash message
        req.flash('error',message);
        return res.redirect('back');    
    }

    let user = await User.findById(req.session.user[0]._id);
    if(user){
        let oldPassword;
        oldPassword = await bcrypt.compare(req.body.Oldpassword,user.password);
        if(req.session.user[0].accountType == 'googleAccount'){
            oldPassword = req.body.Oldpassword;
        }
        if(oldPassword == true || oldPassword.length > 0){
            
            let saltRound  = 10;
            let salt = await bcrypt.genSalt(saltRound);
            let hash = await bcrypt.hash(req.body.NewpasswordOne,salt);
            let result = await User.findByIdAndUpdate(req.session.user[0]._id,{password:hash,hasLoggedInBefore:true});
            if(result){
                req.flash('success','Password changed successfully');
                return res.redirect('/user/dashboard');
            }else{
                console.log('old password does not matches');
                req.flash('error','Error in changing password');
                return res.redirect('back');
            }
        }else{
            req.flash('error','Old password is incorrect');
            return res.redirect('back');
        }
    }
}


module.exports.forgotPassword = function (req,res){
    res.render('forgotpassword');
}
module.exports.sendNewPassword = async function (req,res){
    let user = await User.find({email:req.body.email});
    
    if(user.length>0){
      
        //new password generator 
      let newPassword = await generator.generate({
        length: 8, 
        numbers: true
    });
        console.log(`new password is ${newPassword}`);
        //has the password
        let saltRound  = 10;
        let salt = await bcrypt.genSalt(saltRound);
        let hash = await bcrypt.hash(newPassword,salt);
        
        
        
        //update the password

        let newUpdate = await User.findByIdAndUpdate(user[0]._id,{password:hash});

        if(newUpdate){
            //send email to user
            mail.sendEmail(req.body.email,newPassword);

            req.flash('success','New password has been send to your email');
        }else{
            req.flash('error','Error in changing password');   
        }
        // send email to user  


      return res.redirect('back');
    }else{
        req.flash('error','No user found with this email');
        return res.redirect('back');
    }   
}


// for google oAuth login/sign up

module.exports.googleLogin = function (req,res){
    // const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
    
    const options = {
        client_id:process.env.googleClientId,
        redirect_uri:process.env.googleOAuthRedirect,
        response_type:'code',
        prompt:'consent',
        access_type:'offline',
        scope:[
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(' ')
    }
    

    const stringifiedParams = new URLSearchParams(options);
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
    return res.redirect(googleLoginUrl);
}

async function getGoogleAuthToken({code}){
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id:process.env.googleClientId,
        client_secret:process.env.googleClientSecret,
        redirect_uri:process.env.googleOAuthRedirect,
        grant_type:'authorization_code'
    };
    
    try {
        const res = await axios.post(url, qs.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
          
        });
        if(res){
            const { access_token, id_token } = res.data;
            return { accessToken: access_token, idToken: id_token };
        }
    } catch (error) {
        console.log(`Error here is ${error}`);
    }
    
}

async function  getOtherData(accessToken){
    const { data } = await axios({
        url:'https://www.googleapis.com/oauth2/v2/userinfo',
        method:'get',
        headers:{
            Authorization: `Bearer ${accessToken}`,
        }
    });
    if(data){
        console.log(data);
        return data;
    }
}
//after user select his gmail accoutn to sign in we will be doing this
module.exports.googleAuth = async function(req,res){
    //get a code from 
    const code = req.query.code;
    
   
     const data =   await getGoogleAuthToken({code}); 
    
     if(data){
        //get user data and other data as well
        let userData = await getOtherData(data.accessToken);
        if(userData){
            let password  = await bcrypt.hash(userData.email,10);
            // res.send(userData.email);
            let email = userData.email;
            let result = await User.find({email:email});
            if(result.length>0){
                console.log('Result found');
                req.flash('success','Logged in successfully');
                req.session.user = result;
                req.session.isLoggedIn = true;
                res.redirect('/user/dashboard/');
            }else{
                console.log('Result not found');
               let createdUser =  await User.create({
                    email: email,
                    accountType:'googleAccount',
                    password: password
                });
                if(createdUser){
                    console.log(createdUser);
                    req.flash('success','User created successfully');
                    res.redirect('/');
                    
                }else{
                   
                    req.flash('error','Error in google sign in');
                    res.redirect('/');
                }
            }
        }
     }
    
}

module.exports.googleAuthSuccess = function(req,res){
    if(req.session.user){
        console.log('session exists');
        res.redirect('/user/dashboard/');
    }else{
        console.log('session does not exists');
    }
    
}


