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
require('../models/Batiment');

lienErreur = '/error';
lienAll = '/batiments/';
lienAjouter = '/batiments';
lienModifier = '/batiments';
lienSupprimer = '/batiments/:id';
lienGet = '/batiments/:id';

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
        res.render(pageBatiments, batiments);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Batiment = mongoose.model('Batiment');
    let newBatiment = new Batiment(req.body);
    newBatiment.id = newBatiment._id;

    newBatiment.save().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Batiment').updateOne({id : req.body.id}, {$set : req.body}, (err, updatedBatiment)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Batiment = mongoose.model('Batiment');
    Batiment.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Batiment').findOne({id : req.params.id}).then((batiment)=>{
        if(batiment){
            res.render(pageBatiment, batiment);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});