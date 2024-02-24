import { Router } from 'express';
const router = Router();
import Post from '../../models/Post.js';


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
        

        const data = await Post.aggregate([ { $sort: {createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec()

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);


        res.render('index',{
            locals,
            data,
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
        res.render('web/Post/post', { locals,post, currentRoute: `/post/${slug}` });
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