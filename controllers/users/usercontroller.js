const {validationResult} = require('express-validator');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
module.exports.dashboard = function (req,res){
    res.render('dashboard');
}


module.exports.passwordReset = function (req,res){
    console.log(req.session.user);
    res.render('passwordreset',{
        oldPassword: req.session.user[0].password,
        accountType: req.session.user[0].accountType
    });
}

module.exports.createUser = async function (req,res){
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(422).json({errors: errors.array()});
        let message = [];
        let result = errors.array();
        for(let i=0;i<result.length;i++){
            message.push(result[i].msg);
        }
        // set up flash message
        req.flash('error',message);
        return res.redirect('back');    
    }
    
    let findUser = await User.find({email:req.body.email});
    
    if(findUser.length!=0){
        console.log(findUser);
        req.flash('error','User already exists');
        return res.redirect('back');
    }else{

        let saltRound  = 10;
        let salt = await bcrypt.genSalt(saltRound);
        let hash = await bcrypt.hash(req.body.password,salt);
        
        if(hash){
            console.log(hash);
            let user = await User.create({
                email:req.body.email,
                password: hash
            });
            if(user){
                console.log(user);
                console.log(`Password is ${hash}`);
                req.flash('success','User created successfully. Now login here');
                return res.redirect('/');
            }else{
                req.flash('error','Error in creating user');
                return res.redirect('back');
            }
        }
        
        
        
    }       
}