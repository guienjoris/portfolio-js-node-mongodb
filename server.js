const express = require('express')
const app = express()
const port = 3000
var bodyParser= require('body-parser');
var mongoose= require('mongoose');
var urlmongo = "mongodb://localhost:27017/test";
let Project = require ('./models/project-model');
let Contact = require ('./models/contact-model');
var Account = require('./models/account')
var passport = require('passport');
var multer = require ('multer');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
//Stockage de multer pour l'image du projet
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
    cb(null, __dirname+'/uploads');
    },
    filename: function(req, file, cb) {
    cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

app.use(session({
    cookieName: 'session',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // dossier public dans lequel on mettra les CSS
app.use(express.static('uploads'))// dossier public pour le stockage des médias



app.set('view engine' , 'ejs'); //utilisation de EJs dans node/express

mongoose.connect(urlmongo , { useNewUrlParser: true }); // Connexion à MongoDB
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', () =>{
    console.log("Connexion à la base OK"); 
}); 

app.get('/register', (req,res) =>{

        res.render('register',{title: 'Sign-up'});
    
});
app.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
        return res.render('register', { error : err.message });
    }

    passport.authenticate('local' ),(req, res, function () {
        req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
            });
        });
    });
});
app.get('/login',(req,res)=>{
    
        res.render('login',{
            username: req.user,
            title: ' Sign-in',
            subTitle: 'Come back please!'
        });
    });
app.post('/login', passport.authenticate('local'),(req, res)=>{
    if ( req.session.passport.user != null){
        res.redirect('/');
    }else{
        res.redirect('/register');
    }
});
app.get('/logout',(req,res)=>{
    if ( req.session.passport.user != null){
        req.logout();
        res.redirect('/');
    }else{
        res.redirect('/')
    }
});




app.get('/contact' , (req,res) => {
    res.render('contact');  //L'adresse /contact renvoie vers la page contact.ejs
})
app.get('/admin',(req, res) =>{
    if ( req.session.username = 'Admin'){
        res.render( 'admin'); //L'adresse /admin renvoie vers la page admin.ejs
    }else{
        res.send("Accès non autorisé");
        res.redirect('/');
    }
})

app.post('/admin-post', upload.single('media') , ( req,res) => { //upload de l'image et des inputs sur la BDD
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
// récupération de la BDD pour l'afficher sur /
app.get('/', (req, res) =>{ 
            Project.find((err, posts) =>{
                if (err){ res.send(err)}
                return posts;

                })

                .then (posts => {
                    res.render("index" , {posts : posts })
                })
        });

app.post('/contact-post' , (req , res) =>{
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


app.listen(port, () => console.log(`Example app listening on port:${port} !`))
