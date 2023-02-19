const express = require('express');
const router = express.Router();
const login = require('../controllers/login/logincontroller');
const checkLoggedIn = require('../middlewares/checkAuthentication');



router.get('/', checkLoggedIn.isAlreadyLoggedIn ,login.signIn);


router.get('/register',checkLoggedIn.isAlreadyLoggedIn ,login.register );
router.get('/logout',login.logout);
router.get('/forgot-password',checkLoggedIn.isAlreadyLoggedIn ,login.forgotPassword);
router.post('/forgot-password',checkLoggedIn.isAlreadyLoggedIn,login.sendNewPassword);
router.use('/user', require('./user'));


module.exports = router;