const express = require('express');
const router = express.Router();
var passport = require('passport');
let Contact = require ('../models/contact-model');

var mailer = require('nodemailer');
var smtpTransport= require('nodemailer-smtp-transport')
var transport = mailer.createTransport(smtpTransport({
    service: "gmail",
    auth:{
        user: "portfolioprod@gmail.com",
        pass: "portfoliosimplon83."
    }}));


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
        res.redirect( '/');
        console.log("Message bien envoyé!");

    var mailContent = {
        from: req.body.email,
        to: 'guienjoris@gmail.com',
        subject: req.body.title_contact ,
        html: ` <p>Message de l'utilisateur:</p><p> ${req.body.textarea_contact}</p><p> De:</p><p> ${req.body.email}</p>`
    }
    transport.sendMail(mailContent, function(error, res){
        if(error){
            console.log("Erreur lors de l'envoi de l'email!");
            console.log(error);
        }else{
            console.log('Mail envoyé avec succès!');
        }
        transport.close();
    });
    
})

module.exports = router;