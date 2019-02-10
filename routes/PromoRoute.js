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
require('../models/Promo');

let lienErreur = '/error';
let lienFindAll = '/';
let lienAjouter = '/add';
let lienModifier = '/update/:id';
let lienSupprimer = '/delete/:id';
let lienGet = '/get/:id';

let pageErreur ='';
let pagePromo = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    console.log("error");
})

// -- FIND ALL
app.get(lienFindAll, function (req, res) {
    let Promo = mongoose.model('Promo');
    Promo.find().then((promos)=>{
        res.send(promos);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Promo = mongoose.model('Promo');
    let promo1 = new Promo(req.body);
    promo1.id = promo1._id;

    promo1.save().then(()=>{
        res.send(promo1);
    },(err)=>{
        res.send(err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Promo').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedPromo)=>{
       if(err){
            res.send(err);
       }else{
            res.send(updatedPromo);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Promo = mongoose.model('Promo');
    Promo.find({_id : req.params.id}).deleteOne().then(()=>{
        res.render(lienFindAll);
    },(err)=>{
        res.send(err);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Promo').findOne({_id : req.params.id}).then((promo)=>{
        if(promo){
            res.send(promo);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;