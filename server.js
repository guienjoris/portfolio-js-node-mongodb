const express = require('express')
const app = express()
const port = 3000
var bodyParser= require('body-parser');
var mongoose= require('mongoose');
var urlmongo = "mongodb://localhost:27017/test";
let projectModel = require ('./models/project-model');
var multer = require ('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
    cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
    cb(null, file.originalname);
    }
  });
var upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




app.set('view engine' , 'ejs');

mongoose.connect(urlmongo , { useNewUrlParser: true });
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', () =>{
    console.log("Connexion à la base OK"); 
}); 




app.get('/', (req, res) =>{
    res.render(__dirname + '/index');
    
})

app.get('/admin',(req, res) =>{
    res.render(__dirname + '/admin');
})

app.post('/admin-post', upload.single('media'), ( req,res) => {
    var titre = req.body.titre;
    var description = req.body.description;
    var auteur = req.body.auteur;
    var media = req.file.originalname;    
    console.log(req.file);
    
    let newPost = new projectModel ({ 
        title: titre,
        author: auteur,
        describe: description,
        image : media
    });
    
    newPost.save()
        .then(data => {
            console.log(data)
        })
        .catch(err => {
            console.error(err)
        })
        res.render(__dirname + '/admin');
    

})


app.listen(port, () => console.log(`Example app listening on port:${port} !`))
