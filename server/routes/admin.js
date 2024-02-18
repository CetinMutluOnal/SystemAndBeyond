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
        return res.status(401).json({ message:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error){
        console.log(error);
    };
    
}

/**
 *
 * Get Dashboard
 */
router.get('/admin/dashboard',authMiddleware ,async(req, res) => {
    
    try {
        const locals= {
            title: "Admin",
            description: "Created By System And Beyond Squad."
        }
        const data = await Post.find();
        res.render('admin/dashboard',{
            locals,
            data,
            layout: 'layouts/admin'
        });
    } catch (error) {
        
    }

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

router.post('/admin/register', async(req,res) => {
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
 * Admin - Login
 */

router.post('/admin/login', async(req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (!user){
            res.status(401).json({message: 'We can not find any user with this e-mail.'})
        }
        if (await bcrypt.compare(password,user.password)){
            const token = jwt.sign({ userId: user._id}, jwtSecret );
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        } else {
            console.log("Wrong Password");
        }
    } catch (error) {
        console.log(error);
    }
})

/**
 * Post /
 * Admin - Logout
 */

router.get('/admin/logout', authMiddleware, async(req,res) => {
    res.clearCookie('token');
    res.redirect('/');
})

/**
 *
 * Get Admin Posts
 */
router.get('/admin/posts',authMiddleware ,async(req, res) => {
    
    try {
        const locals= {
            title: "Posts Controls",
            description: "Created By System And Beyond Squad."
        }
        const data = await Post.find();
        res.render('admin/posts/posts',{
            locals,
            data,
            layout: 'layouts/admin'
        });
    } catch (error) {
        
    }

});

/**
 * Post /
 * Admin - Create New Post
 */

router.get('/admin/add-post',authMiddleware, async(req, res) => {
    
    try {
        const locals= {
            title: "Add Post",
            description: "Created By System And Beyond Squad."
        }
        const data = await Post.find();
        res.render('admin/posts/add-post',{
            locals,
            layout: 'layouts/admin'
        });
    } catch (error) {
        
    }

});

/**
 * Post /
 * Admin - Create New Post
 */

router.post('/admin/add-post',authMiddleware, async(req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
        })
        try {
            await Post.create(newPost);
            res.redirect('/admin/posts');   
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }

});

router.get('/admin/edit-post/:id',authMiddleware, async(req, res) => {
    
    try {
        const locals= {
            title: "Edit Post",
            description: "Created By System And Beyond Squad."
        }
        const data = await Post.findOne({_id: req.params.id});
        res.render('admin/posts/edit-post',{
            locals,
            data,
            layout: 'layouts/admin'
        });
    } catch (error) {
        
    }

});

router.put('/admin/edit-post/:id',authMiddleware, async(req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            updatedAt: Date.now(),
        });

        res.redirect(`/admin/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }

});

/**
 * Delete /
 * Admin - Delete Post
 */

router.delete('/admin/delete-post/:id',authMiddleware, async(req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);

        res.redirect(`admin/posts`);
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;