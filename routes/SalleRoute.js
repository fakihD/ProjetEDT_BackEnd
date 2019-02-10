const app = require('express').Router();
const session = require('cookie-session');
const mongoose = require('mongoose');

// --- middleware
// - body-parser needed to catch and to treat information inside req.body
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({secret: 'todotopsecret'}))

// -- Load model needed for the project
require('../models/Salle');

let lienErreur = '/error';
let lienFindAll = '/';
let lienAjouter = '/add';
let lienModifier = '/update/:id';
let lienSupprimer = '/delete/:id';
let lienGet = '/get/:id';

let pageErreur ='';
let pageSalle = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    console.log("error");
})

// -- FIND ALL
app.get(lienFindAll, function (req, res) {
    let Salle = mongoose.model('Salle');
    Salle.find().then((salles)=>{
        res.send(salles);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Salle = mongoose.model('Salle');
    let newSalle = new Salle(req.body);
    newSalle.id = newSalle._id;

    newSalle.save().then(()=>{
        res.send(newSalle);
    },(err)=>{
        res.send(err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Salle').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedSalle)=>{
       if(err){
            res.send(err);
       }else{
            res.send(updatedSalle);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Salle = mongoose.model('Salle');
    Salle.find({_id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.send(err);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Salle').findOne({_id : req.params.id}).then((salle)=>{
        if(salle){
            res.send(salle);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send(err);
    });
});

module.exports = app;