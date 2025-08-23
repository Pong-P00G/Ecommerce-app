const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller.js');

router.get('/Users', userController.getAllUsers);
router.get('/Users/:id', userController.getUsersById);
router.post('/Users', userController.createUsers);
router.put('/Users/:id', userController.updateUsers);
router.delete('/Users/:id', userController.deleteUsers);

module.exports = router;