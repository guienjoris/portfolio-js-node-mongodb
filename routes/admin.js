const express = require('express');
const router = express.Router();


router.get('/admin',(req, res) =>{
    if (!req.isAuthenticated())
    {
        res.redirect('/');
    }
    else if (req.session.passport.user !== "Admin")
    {
        res.redirect('/');
    }
    else{
    res.render('admin'); //L'adresse /admin renvoie vers la page admin.ejs
    }
})




module.exports = router;
