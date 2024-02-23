import { Router } from "express";
const router = Router();
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Category from "../../models/Category.js";
import { authMiddleware } from "./auth.js";

/**
 * Get Users Page
 */

router.get('/users', authMiddleware, async (req, res) => {
    try{
        const locals= {
            title: 'Manage Users',
            description: "Created By System And Beyond Squad.",
        }
        const users = await User.find();
        res.render('admin/users/users',{
            locals,
            users,
            layout: ('layouts/admin')
        })
    } catch(error) {
        console.log(error);
    }
    
});

router.get('/edit-user/:id', authMiddleware, async (req, res) => {
    try{
        const locals= {
            title: "Edit User",
            description: "Created By System And Beyond Squad."
        }
        const user = await User.findOne({_id: req.params.id});
        res.render('admin/users/edit-user', {
            locals,
            user,
            layout:('layouts/admin')
        });
    } catch(error) {
        console.log(error);
    }
    
});

router.put('/edit-user/:id', authMiddleware, async (req, res) => {
    try{
        await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            about: req.body?.about,
            updatedAt: Date.now()
        });
        res.redirect(`/admin/edit-user/${req.params.id}`,)
    } catch(error) {
        console.log(error);
    }
    
});

router.delete('/users/:id', authMiddleware, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users');
    } catch(error) {
        console.log(error);
    }
    
});

export default router;