const {validationResult} = require('express-validator');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');

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
        
        let oldPassword = await bcrypt.compare(req.body.Oldpassword,user.password);
        if(oldPassword){
            
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