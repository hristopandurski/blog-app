const express = require('express');

const UserController = require('../controllers/user');

const router = express.Router();

router.post('/signup', UserController.createUser);

router.post('/getUserInfo', UserController.userInfo);

router.patch('/updateUser', UserController.userUpdate);

router.post('/login', UserController.userLogin);

router.post('/login/facebook', UserController.facebookLogin);

module.exports = router;