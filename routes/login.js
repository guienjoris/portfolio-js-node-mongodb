const express = require('express');
const router = express.Router();
var passport = require('passport');


router.get('/login',(req,res)=>{
    
    res.render('login',{
        username: req.user,
        title: ' Sign-in',
        subTitle: 'Come back please!'
    });
    
});
router.post('/login', passport.authenticate('local'),(req, res)=>{
if ( req.session.passport.user !== "Admin"){
    console.log("mode user");
    res.redirect('/');
}
if ( req.session.passport.user == "Admin"){
    res.redirect('/admin');
    console.log('mode admin')
}
return req.session.passport.user

});

module.exports= router;