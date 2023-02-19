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

module.exports.loginValidator = [
    body('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('password').not().isEmpty().withMessage('Password is required')
];


module.exports.changePasswordValidator = [ 
    body('Oldpassword').not().isEmpty().withMessage('Old password is required'),
    body('NewpasswordOne').not().isEmpty().withMessage('New password is required').isLength({min:8}).withMessage('Password must be at least 8 characters long'),
    body('NewpasswordConfirm').custom((value,{req})=>{
        if(value!== req.body.NewpasswordOne){
            throw new Error('New passwords do not match');
        }
        return true;
    })

];
