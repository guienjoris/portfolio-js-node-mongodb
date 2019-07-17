const express = require('express');
const router = express.Router();
var passport = require('passport');
let Contact = require ('../models/contact-model');

router.get('/contact' , (req,res) => {
    res.render('contact');  //L'adresse /contact renvoie vers la page contact.ejs
})


router.post('/contact-post' , (req , res) =>{
    var mail = req.body.email;
    var title = req.body.title_contact;
    var message = req.body.textarea_contact;
    console.log(req.body)

    let newContact = new Contact({
        email: mail,
        titlecontact: title,
        messagecontact: message
    })
    newContact.save() // envoie sur la BDD
        .then(data => { 
            console.log(data)
        })
        .catch(err => {
            console.error(err)
        })
        res.render( 'contact');
        console.log("Message bien envoyé!");

})

module.exports = router;