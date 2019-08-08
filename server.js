const express = require('express')
const app = express()
const port = 4000
var bodyParser= require('body-parser');
var mongoose= require('mongoose');
var urlmongo = "mongodb+srv://frugal:frugal@cluster0-twqri.mongodb.net/test?retryWrites=true&w=majority";
let Project = require ('./models/project-model');
var Account = require('./models/account');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
const adminRoute = require('./routes/admin');
const registerRoute= require ('./routes/register');
const loginRoute = require('./routes/login');
const contactRoute = require('./routes/contact');

app.use(session({
    cookieName: 'session',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Account.authenticate())); //passport pour la gestion de l'authentification
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // dossier public dans lequel on mettra les CSS
app.use(express.static('uploads'))// dossier public pour le stockage des médias
app.set('view engine' , 'ejs'); //utilisation de EJs dans node/express

mongoose.connect(urlmongo , { useNewUrlParser: true ,useFindAndModify: false } ); // Connexion à MongoDB
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', () =>{
    console.log("Connexion à la base OK"); 
}); 




app.use("/", registerRoute);
app.use('/', loginRoute);
app.use('/', contactRoute);
app.use("/", adminRoute);

app.get('/logout', function (req, res){
    req.session.destroy(function (err) {
        
      res.redirect('/'); //Supprimmer la session en cours
    });
});



// récupération de la BDD pour l'afficher sur l'index
app.get('/', (req, res) =>{ 
            Project.find((err, posts) =>{
                if (err){ res.send(err)}
                return posts ;
                
                }).sort( { createdOn: -1 } )

                .then (posts  => {
                    res.render("index" , {posts : posts })
                })
                .catch(function(error) {
                    console.log(error);
                });
                
            });





app.listen(port, () => console.log(`Example app listening on port:${port} !`))
