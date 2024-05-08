import { Router } from "express";
const router = Router();
import Post from "../../models/Post.js";
import Category from "../../models/Category.js";
import { authMiddleware } from "./auth.js";
import uploadHelpers from "../../helpers/uploadHelpers.js";
const postCoverImageUpload = uploadHelpers.postCoverImageUpload;


/**
 *
 * Get Admin Posts
 */
router.get('/posts',authMiddleware ,async(req, res) => {
    
    try {
        const locals= {
            title: "Posts Controls",
            description: "Created By System And Beyond Squad."
        }
        const users = await Post.find().populate('author','name').populate('category','title');
        res.render('admin/posts/posts',{
            locals,
            users,
            layout: 'layouts/admin'
        });
    } catch (error) {
        
    }

});

/**
 * Post /
 * Admin - Create New Post
 */

router.get('/add-post',authMiddleware, async(req, res) => {
    
    try {
        const categories = await Category.find();
        const locals= {
            title: "Add Post",
            description: "Created By System And Beyond Squad."
        }
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

router.post('/add-post',authMiddleware, postCoverImageUpload.single('cover'), async(req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            coverImage: req.file.filename,
            content: req.body.content,
            category: req.body.category,
            author: req.userId
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

router.get('/edit-post/:id',authMiddleware, async(req, res) => {
    
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

router.put('/edit-post/:id',authMiddleware,postCoverImageUpload.single('cover'), async(req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            coverImage: req.file?.filename,
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

router.delete('/delete-post/:id',authMiddleware, async(req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);

        res.redirect(`/admin/posts`);
    } catch (error) {
        console.log(error);
    }

});

export default router;