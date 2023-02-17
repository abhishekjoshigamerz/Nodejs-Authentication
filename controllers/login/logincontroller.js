


module.exports.register = function (req,res){
    res.render('home');
}

module.exports.signIn = function (req,res){
    res.render('signin');
}

module.exports.logout = function (req,res){
    return res.redirect('/');
}