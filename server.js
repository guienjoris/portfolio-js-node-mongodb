const express = require('express')
const app = express()
const port = 3000
var bodyParser= require('body-parser');
var mongoose= require('mongoose');
var urlmongo = "mongodb://localhost:27017/test";
let projectModel = require ('./models/project-model');
var multer = require ('multer');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


var storage = multer.diskStorage({
    destination: (req, file, callback)=> {
        fs.mkdir('./uploads', function(err){
            if(err){
                console.log(err.stack)
            } else {
                callback(null, './uploads');
            }
        })
    },
    filename: (req, file , callback) =>{
        callback(null, file.fieldname +"-" + Date.now());
    }
});

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

app.post('/tutu', ( req,res) => {
    var titre = req.body.titre;
    var description = req.body.description;
    var auteur = req.body.auteur;
    var media = req.body.media;
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }
    }).single('media');
    upload(req, res, (err)=>{
        if(err){
        return  res.end("Erreur de televersement!");
        }
        res.end("Le fichier a ete televerser!");
    })
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

})


app.listen(port, () => console.log(`Example app listening on port:${port}`))
