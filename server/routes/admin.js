const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
/**
 *
 * Check Login
 */

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).jsoon({ message:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error){
        console.log(error);
    };
    
}

router.get('/dashboard', authMiddleware, async(req, res) => {
    res.render('admin/dashboard');
});



/**
 * GET /
 * Admin - Login Page
 */

router.get('/admin', async (req,res) => {
    try {
        const locals= {
            title: "Admin",
            description: "Created By System And Beyond Squad."
        }

    res.render('admin/index', {locals, layout: 'layouts/admin'});
    } catch (error) {
        console.log(error);
    }
})

/**
 * Post /
 * Admin - Register
 */

router.post('/register', async(req,res) => {
    try {
        const { name,email, password } = req.body;
        const user = await User.create({name,email, password: await bcrypt.hash(password,10) });
        res.status(201).json({message: 'User Created', user});
    } catch (error) {
        console.log(error);
    }
})

/**
 * Post /
 * Admin - Register
 */

router.post('/login', async(req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (user.password ==  bcrypt.hash(password,10)){
            res.status(201).json({message: 'User Created', user});
        } else {
            console.log("Wrong Password");
        }
        res.status(201).json({message: 'User Logged In', user});
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;