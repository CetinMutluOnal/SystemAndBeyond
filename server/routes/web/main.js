import { Router } from 'express';
const router = Router();
import Post from '../../models/Post.js';
import User from '../../models/User.js';
const address = process.env.HOST_ADDRESS;


/**
 * GET /
 * HOME
 */
router.get('', async (req, res) => {
    const locals= {
        title: "System And Beyond",
        description: "Created By System And Beyond Squad."
    }

    try {
        let perPage= 10;
        let page= req.query.page || 1;
        let sliderCount= 5;
        
        const latestPosts= await Post.aggregate([{ $sort: {createdAt: -1 } }])
        .limit(sliderCount)
        .exec();
        const data = await Post.aggregate([ { $sort: {createdAt: -1 } } ])
        .skip(perPage * page - perPage + sliderCount )
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);


        res.render('web/home',{
            locals,
            data,
            latestPosts,
            address,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/',
            });
    } catch(error){
        console.log(error);
    }
});

/**
 * GET /
 * POST :id
 */

router.get('/post/:id', async (req,res) => {
    try {
        const locals= {
            title: "System And Beyond",
            description: "Created By System And Beyond Squad."
        }

        let slug = req.params.id;
        const post = await Post.findById({ _id: slug })
        const author = await User.findById(post.author)
        res.render('web/Post/post', {
            locals,
            address,
            post,
            author,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error);
    }
})

/**
 * GET /
 * POST - searchTerm
 */

router.post('/search', async (req,res) => {
    try {
        const locals= {
            title: "Search",
            description: "Created By System And Beyond Squad."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[a-zA-Z0-9]/g,"")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            ]
        });



        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
})

// router.get('linux', (req,res) => {
//     res.render('about')
// })

// router.get('cloud', (req,res) => {
//     res.render('about')
// })

// router.get('about', (req,res) => {
//     res.render('about')
// })

export default router;