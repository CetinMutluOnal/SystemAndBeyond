import { Router } from 'express';
const router = Router();
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
import Category from '../../models/Category.js';
const { verify, sign } = pkg;
const jwtSecret = process.env.JWT_SECRET;
/**
 *
 * Check Login
 */

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message:'Unauthorized'});
    }

    try{
        const decoded = verify(token, jwtSecret);
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

    res.render('admin/login', {locals, layout: 'layouts/admin-login'});
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
        const user = await User.create({name,email, password: await hash(password,10) });
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
        if (await compare(password,user.password)){
            const token = sign({ userId: user._id}, jwtSecret );
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/admin/dashboard');
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
    res.redirect('/admin');
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
        const categories = await Category.find();
        const locals= {
            title: "Add Post",
            description: "Created By System And Beyond Squad."
        }
        const data = await Post.find();
        res.render('admin/posts/add-post',{
            locals,
            categories,
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
        const selectedCategory = await Category.findOne({title: req.body.category});
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            category: selectedCategory._id
        });
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
        const post = await Post.findOne({_id: req.params.id});
        res.render('admin/posts/edit-post',{
            locals,
            post,
            categories: await Category.find(),
            layout: 'layouts/admin'
        });
    } catch (error) {
        
    }

});

router.put('/admin/edit-post/:id',authMiddleware, async(req, res) => {
    try {
        console.log(req.body.category);
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
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

export default router;