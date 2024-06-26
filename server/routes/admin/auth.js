import { Router } from 'express';
const router = Router();
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { verify, sign } = pkg;
const jwtSecret = process.env.JWT_SECRET;
const address = process.env.IP_ADDRESS
/**
 *
 * Check Login
 */

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/admin/login');
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
router.get('/dashboard',authMiddleware ,async(req, res) => {
    
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

router.get('/',authMiddleware ,async (req,res) => {
    try {
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error);
    }
})

router.get('/login', async (req,res) => {
    try {
        const locals= {
            title: "Admin",
            description: "Created By System And Beyond Squad."
        }

    res.render('admin/auth/login', {locals, layout: 'layouts/admin-login'});
    } catch (error) {
        console.log(error);
    }
})


/**
 * Get /
 * Admin - Register
 */

router.get('/register', async(req,res) => {
    try {
        const locals= {
            title: "Admin",
            description: "Created By System And Beyond Squad."
        }

    res.render('admin/auth/register', {locals, layout: 'layouts/admin-login'});
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
        await User.create({name,email, password: await hash(password,10) });
        res.redirect('/admin') 
    } catch (error) {
        console.log(error);
    }
})

/**
 * Post /
 * Admin - Login
 */

router.post('/login', async(req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email}).select('+password');
        if (!user){
            res.status(404).render('response/notfound',{
                layout: 'layouts/main',
                currentRoute:'/',
                message: "Email Doesn't Exist"
            });
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

router.get('/logout', authMiddleware, async(req,res) => {
    res.clearCookie('token');
    res.redirect('/admin');
})


export default router;