import { Router } from 'express';
const router = Router();
import Post from '../../models/Post.js';
import Category from '../../models/Category.js';
import { authMiddleware } from './auth.js';

router.get('/categories', authMiddleware, async (req,res) => {
    try {
        const locals = {
            title: "Admin Categories Control",
            description: "Created By System And Beyond Squad."
        }
        const categories = await Category.find();
        if (!categories){
            res.status('404').json({message: 'Not Found'});
        }
        res.render('admin/categories/category',{
            categories,
            locals,
            layout: 'layouts/admin'
        });
    } catch (error) {
        console.log(error);
    }
});

//TODO:

// router.get('/admin/category/:id', authMiddleware, async (req, res) => {
//     try {
//         const locals= {
//             title: "System And Beyond",
//             description: "Created By System And Beyond Squad."
//         }

//         const category = await Category.findById(req.params.id);

//         let slug = req.params.id;
//         const data = await Category.findById({ _id: slug })
//         res.render('post', { locals,data, currentRoute: `/post/${slug}` });
//         if( !category){
//             res.status('404').json({message: 'Not Found'});
//         }
//         res.render('/admin/category/');
//     } catch (error) {
//         console.log(error);
//     }
// });


router.get('/add-category', authMiddleware, async (req,res) => {
    try{
        res.render('admin/categories/add-category', {
            layout: 'layouts/admin'
        })
    } catch(error){
        console.log(error);
    }
}) 

router.post('/category', authMiddleware, async (req, res) => {
    try {
        const newCategory = await Category.create({
            title: req.body.title,
        });
        if( !newCategory){
            res.status('502').json({message: 'Bad Request'});
        }
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
});

router.get('/edit-category/:id', authMiddleware, async (req,res) => {
    try{
        const locals= {
            title: "Edit Category",
            description: "Created By System And Beyond Squad."
        }
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status('404').json({ message: 'Not Found'});
        }
        res.render('admin/categories/edit-category',{
            category,
            locals,
            layout: 'layouts/admin',
        })

    } catch(error){
        console.log(error);
    }
})

router.put('/edit-category/:id', authMiddleware, async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
        });
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
});

router.delete('/delete-category/:id', authMiddleware, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
});

export default router;
