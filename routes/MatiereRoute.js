express = require('express'),
app = express();
session = require('cookie-session');

// --- middleware
// - body-parser needed to catch and to treat information inside req.body
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({secret: 'todotopsecret'}))

// -- Load model needed for the project
require('../models/Matiere');

lienErreur = '/error';
lienAll = '/matieres/';
lienAjouter = '/matieres';
lienModifier = '/matieres';
lienSupprimer = '/matieres/:id';
lienGet = '/matieres/:id';

pageErreur ='';
pageMatieres = '';
pageMatiere = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    let Matiere = mongoose.model('Matiere');
    Matiere.find().then((matieres)=>{
        res.render(pageMatieres, matieres);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Matiere = mongoose.model('Matiere');
    let newMatiere = new Matiere(req.body);
    newMatiere.id = newMatiere._id;

    newMatiere.save().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Matiere').updateOne({id : req.body.id}, {$set : req.body}, (err, updatedMatiere)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Matiere = mongoose.model('Matiere');
    Matiere.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Matiere').findOne({id : req.params.id}).then((matiere)=>{
        if(matiere){
            res.render(pageMatiere, matiere);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});