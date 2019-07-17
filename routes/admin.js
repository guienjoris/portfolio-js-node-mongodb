const express = require('express');
const router = express.Router();
var multer = require ('multer');
let Project = require ('../models/project-model');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
    cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
    cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

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

router.post('/admin-post', upload.single('media') , ( req,res) => { //upload de l'image et des inputs sur la BDD
    var titre = req.body.titre;
    var description = req.body.description;
    var auteur = req.body.auteur;
    var media = req.file.originalname;    
    console.log(req.file);
    
    let newPost = new Project ({ // Stockage selon le modèle déclaré dans project-model.js
        title: titre,
        author: auteur,
        describe: description,
        image : media
    });
    
    newPost.save() // envoie sur la BDD
        .then(data => { 
            console.log(data)
        })
        .catch(err => {
            console.error(err)
        })
        res.render( 'admin');
        console.log("Projet bien envoyé");
})


module.exports = router;
