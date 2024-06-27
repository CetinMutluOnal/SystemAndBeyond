import { Router } from "express";
const router = Router();
import User from "../../models/User.js";
const address = process.env.HOST_ADDRESS;

router.get('/author/:username', async (req, res) => {
    try{
        const locals= {
            title: "Author Profile",
            description: "Created By System And Beyond Squad."
        }
        const author = await User.findOne({name: req.params.username});
        res.render('web/author/author-profile', {
            locals,
            address,
            author,
            layout:('layouts/admin')
        });
    } catch(error) {
        console.log(error);
    }
    
});

export default router;
