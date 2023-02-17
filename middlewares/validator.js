const {body} = require('express-validator');

module.exports.registerValidator = [
    body('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('password').not().isEmpty().withMessage('Password is required').isLength({min:8}).withMessage('Password must be at least 8 characters long'),
    body('confirmPassword').custom((value,{req})=>{
        if(value!== req.body.password){
            throw new Error('Passwords do not match');
        }
        return true;
    })

];

