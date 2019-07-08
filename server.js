const express = require('express')
const app = express()
const port = 3000
var bodyParser= require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
})

app.get('/admin',(req, res) =>{
    res.sendFile(__dirname + '/admin.html');
})

app.post('/tutu', ( req,res) => {
    var titre = req.body.titre;
    var description = req.body.description;
    var auteur = req.body.auteur;

    console.log (titre , description , auteur);
})


app.listen(port, () => console.log(`Example app listening on port:${port}`))
