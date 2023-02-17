const express = require('express');
const router = express.Router();
const login = require('../controllers/login/logincontroller');




router.get('/', login.signIn);


router.get('/register',login.register );
router.get('/logout',login.logout);

router.use('/user', require('./user'));


module.exports = router;