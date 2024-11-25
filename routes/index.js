var express = require('express');
var router = express.Router();
const admincontroller = require('../controller/adminController');
const authAdmin = require('../middleware/authAdmin');

// get method
router.get('/', admincontroller.homeReg);
router.get('/login', admincontroller.loginPage);
router.get('/signout', admincontroller.signout);
router.get('/welcomePage', authAdmin, admincontroller.welcomePage);


// post method
router.post('/adminReg', admincontroller.adminReg);
router.post('/login', admincontroller.loginProcess);


module.exports = router;
