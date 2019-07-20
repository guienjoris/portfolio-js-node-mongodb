const express = require('express');
const router = express.Router();
var Account = require('../models/account');
var passport = require('passport');


router.get('/register', (req,res) =>{

    res.render('register');
});

router.post('/register', function(req, res, next) {
Account.register(new Account({ username : req.body.username }), req.body.password, function(err) {
if (err) {
    return res.render('register', { error : err.message });
}else{
    res.redirect('/');
    }
});
});

module.exports = router;
