const express = require('express');
const router = express.Router();
const userController = require('../controllers/users/usercontroller');
const validator = require('../middlewares/validator');

router.post('/create-user',validator.registerValidator,userController.createUser);

module.exports = router;