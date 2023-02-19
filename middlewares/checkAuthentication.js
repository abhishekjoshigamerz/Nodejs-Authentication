module.exports.checkAuthentication = function (req,res,next){
    if(req.session.isLoggedIn && req.session.user){
        return next();
    }
    return res.redirect('/');
}

module.exports.isAlreadyLoggedIn = function (req,res,next){
    if(!req.session.isLoggedIn && !req.session.user){
        return next();
    }
    return res.redirect('/user/dashboard');
}