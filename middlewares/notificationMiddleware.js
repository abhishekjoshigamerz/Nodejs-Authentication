// notification Middlewares
module.exports.setFlash = function (req,res,next){
    res.locals.alerts = req.flash();
    next();
}