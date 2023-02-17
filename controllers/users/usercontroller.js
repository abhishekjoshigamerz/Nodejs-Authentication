const {validationResult} = require('express-validator');

module.exports.dashboard = function (req,res){
    res.render('dashboard');
}


module.exports.passwordReset = function (req,res){
    res.render('passwordreset');
}

module.exports.createUser = function (req,res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }
    return res.redirect('/');
}