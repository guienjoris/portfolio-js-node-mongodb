const express = require('express');
const router = express.Router();
var multer = require ('multer');
let Project = require ('../models/project-model');
let Contact = require ('../models/contact-model')


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
        res.render('forbidden');
    }
    else if (req.session.passport.user !== "Admin")
    {
        res.render('forbidden');
    }
    else{
        Project.find((err, posts) =>{
            if (err){ res.send(err)}
            return posts;
            }).sort( { createdOn: -1 } ).then (posts => {
                Contact.find((err, contacts)=>{
                    if(err){res .send(err)}
                    return contacts
                }).sort({createdOn: -1}).then(contacts => {
                    res.render("admin" , {posts : posts , contacts : contacts})
                }
            )})
            .catch(function(error) {
                console.log(error);
        });
    }
})

router.post('/admin-post', upload.single('media') , ( req,res) => { //upload de l'image et des inputs sur la BDD
    var titre = req.body.titre;
    var description = req.body.description;
    var auteur = req.body.auteur;
    var media = req.file.originalname;
    var lien = req.body.lienduprojet ;
    var language = req.body.language;   
    console.log(req.file);
    
    let newPost = new Project ({ // Stockage selon le modèle déclaré dans project-model.js
        title: titre,
        author: auteur,
        describe: description,
        image : media,
        lien : lien,
        language : language
    });
    
    newPost.save() // envoie sur la BDD
        .then(data => { 
            console.log(data)
        })
        .catch(err => {
            console.error(err)
        })
        res.redirect( 'admin') 
})
//on récupére l'id pour éditer
router.get('/admin/edit/:_id',(req,res)=>{
    const id= req.params._id;
    console.log(id)
    Project.findById(id, (err, post) =>{
        if (err){
            return res.status(500).json(err);
        }
        res.render('edit',{post : post})
    })  
});
//on édite le projet en BDD

router.post('/admin/edit', upload.single('image'), (req,res) =>{
    console.log(req.body)
    if (req.file != undefined) {
        Project.findByIdAndUpdate(req.body.id,{$set: req.body, image: req.file.originalname},(err,result)=>{
            if(err){
                return res.status(500).json(err);
            }
            res.redirect('/admin');
        })
        }
    else{
    Project.findByIdAndUpdate(req.body.id, {$set:req.body } , (err,result) =>{
        
        if (err){
            return res.status(500).json(err);
        }
        res.redirect('/admin');
    })
}})

//on supprime le projet en BDD
router.post('/delete', (req,res)=>{
    Project.findOneAndDelete({_id: req.body.postid})
    .then(() => res.redirect('/admin'))
    .catch(function(error) {
        console.log(error);
    });
})

module.exports = router;
