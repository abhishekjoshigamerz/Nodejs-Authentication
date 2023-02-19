const express = require('express');
const router = express.Router();
const userController = require('../controllers/users/usercontroller');
const loginController = require('../controllers/login/logincontroller');
const validator = require('../middlewares/validator');
const checkLoggedIn = require('../middlewares/checkAuthentication');

router.post('/create-user',validator.registerValidator,userController.createUser);

router.post('/check-authentication',validator.loginValidator,loginController.createSession);

router.get('/dashboard',checkLoggedIn.checkAuthentication,userController.dashboard);

router.get('/password-reset',checkLoggedIn.checkAuthentication,userController.passwordReset);

router.post('/password-reset',checkLoggedIn.checkAuthentication,validator.changePasswordValidator,loginController.changePassword);


module.exports = router;