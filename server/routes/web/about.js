import { Router } from "express";
const router = Router();
import User from '../../models/User.js';
const address = process.env.HOST_ADDRESS;

router.get('/', async(req,res) => {
    try {
        const locals = {
            title: "System And Beyond",
            description: "Created By System And Beyond Squad"
        }
        const users = await User.find().sort({name: 1});
        if (!users) {
            res.status(404).render('response/notfound',{
                layout: 'layouts/main',
                currentRoute:'/',
            });
        }
        res.render('web/about', {
            locals,
            address,
            users,
            layout:('layouts/main'),
            currentRoute:'/about'
        });
    } catch (error) {
        console.log(error)
    }
})

export default router;