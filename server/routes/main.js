const express = require('express');
const router = express.Router();


//Routes
router.get('', (req, res) => {
    const locals= {
        title: "System And Beyond",
        description: "Created By System And Beyond Squad."
    };
    res.render('index', {locals});
});

module.exports = router;