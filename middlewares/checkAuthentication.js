//middlewares for checking authentication and allowing access to certain pages only if user is logged in
// and allowing access to certain pages if user is not logged in
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