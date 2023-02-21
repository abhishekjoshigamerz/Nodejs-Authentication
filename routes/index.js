const express = require('express');
const router = express.Router();
const login = require('../controllers/login/logincontroller');
const checkLoggedIn = require('../middlewares/checkAuthentication');
const usercontroller = require('../controllers/users/usercontroller');


router.get('/', checkLoggedIn.isAlreadyLoggedIn ,login.signIn);


router.get('/register',checkLoggedIn.isAlreadyLoggedIn ,login.register );
router.get('/logout',login.logout);
router.get('/forgot-password',checkLoggedIn.isAlreadyLoggedIn ,login.forgotPassword);
router.post('/forgot-password',checkLoggedIn.isAlreadyLoggedIn,login.sendNewPassword);
router.use('/user', require('./user'));

//manages google-authentication when user clicks the link in page
router.get('/googleSignIn', login.googleLogin);
// redirect URL in google authentication from where google auth works
router.get('/sessions/oauth/google',login.googleAuth);

//manages google-authentication
router.get('/google-auth-success',login.googleAuthSuccess);

//privayc and tos page for google allowing app to be published no use to web application
router.get('/privacy',usercontroller.privacy);
router.get('/tos',usercontroller.terms);

module.exports = router;