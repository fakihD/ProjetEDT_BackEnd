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
require('../models/Batiment');

lienErreur = '/error';
lienAll = '/';
lienAjouter = '/add';
lienModifier = '/update/:id';
lienSupprimer = '/delete/:id';
lienGet = '/get/:id';

pageErreur ='';
pageBatiments = '';
pageBatiment = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    let Batiment = mongoose.model('Batiment');
    Batiment.find().then((batiments)=>{
        res.send(batiments);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Batiment = mongoose.model('Batiment');
    let newBatiment = new Batiment(req.body);
    newBatiment.id = newBatiment._id;

    newBatiment.save().then(()=>{
        res.send(newBatiment);
    },(err)=>{
        res.send(err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Batiment').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedBatiment)=>{
       if(err){
            res.send(err);
       }else{
            res.send(updatedBatiment);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Batiment = mongoose.model('Batiment');
    Batiment.find({_id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Batiment').findOne({_id : req.params.id}).then((batiment)=>{
        if(batiment){
            res.send(batiment);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;