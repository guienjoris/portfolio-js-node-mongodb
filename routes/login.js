const express = require('express');
const router = express.Router();
var passport = require('passport');



router.get('/login',(req,res)=>{
    
    res.render('login');
    
});
router.post('/login', passport.authenticate('local', {failureRedirect:'/register'}),(req, res)=>{
if ( req.session.passport.user != "Admin"){
    console.log(req.session.passport.user);
    res.redirect('/');
}
if ( req.session.passport.user === "Admin"){
    res.redirect('/admin');
    console.log('mode admin')
}

});

module.exports= router;