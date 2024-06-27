import { Router } from "express";
const router = Router();
import Post from "../../models/Post.js";
import Category from "../../models/Category.js";
const address = process.env.HOST_ADDRESS;

/**
 * GET LINUX POSTS
 */

router.get('/:title', async (req,res) => {
    try{
        const locals = {
            title: "System And Beyond",
            description: "Created By System And Beyond Squad"
        }

        let perPage=10;
        let page = req.query.page || 1;

        const category = await Category.findOne({title: `${req.params.title}`});
        if(!category) {
            res.status(404).render('response/notfound',{
                layout: 'layouts/main',
                currentRoute:'/',
            });
        }
        const data = await Post.aggregate([
            { $match: { category: category._id} },
            { $sort : { createdAt: -1} }
    ]);

            const count = await Post.countDocuments({category: category._id});
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage);

            res.render('web/category', {
                locals,
                address,
                data,
                category,
                current: page,
                layout: 'layouts/main',
                nextPage: hasNextPage ? nextPage: null,
                currentRoute:`/${req.params.title}`,
            });
    } catch(error){
        console.log(error);
    }
})

export default router;