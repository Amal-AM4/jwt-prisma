const prisma = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();
const JSON_KEY = process.env.JSON_KEY;

async function homeReg(req, res) {
    try {        
        res.render('index');
    } catch (error) {
        console.error(error);
    }
}

async function adminReg(req, res) {
    const { username, pwd } = req.body;
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10); // encode cheyan password
        const newAdmin = await prisma.Admin.create({
            data: {
                userName: username,
                password: hashedPwd
            }
        });
        console.log(`New Record is added: ${newAdmin}`);
        await prisma.$disconnect();

        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
}

async function loginPage(req, res) {
    try {        
        res.render('login');
    } catch (error) {
        console.error(error);
    }
}

async function loginProcess(req, res) {
    const { username, pwd } = req.body;
    try {
        const admin = await prisma.Admin.findUnique({
            where: {
                userName: username
            }
        });

        if (!admin) {
            return res.status(404).json({message:"Admin not found"});
        }

        let isMatch = await bcrypt.compare(pwd, admin.password);
        if (!isMatch) {
            return res.status(404).json({message:"Invalid password"});
        }

        const token = jwt.sign({adminUUID: admin.adminUUID}, JSON_KEY, {expiresIn:'1h'});
        res.cookie("adminToken", token, {httpOnly: true});

        res.redirect('/welcomePage');
    } catch (error) {
        console.error(error);
    }
}

async function welcomePage(req, res) {
    try {        
        res.render('welcome');
    } catch (error) {
        console.error(error);
    }
}

async function signout(req, res) {
    try {
        res.clearCookie('adminToken');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
    }
}


module.exports = { homeReg, adminReg, loginPage, loginProcess, signout, welcomePage }