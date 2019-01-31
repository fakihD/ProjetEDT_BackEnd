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
require('../models/Prof');

lienErreur = '/error';
lienFindAll = '/AllProfs';
lienAjouter = '/AjouterProf';
lienModifier = '/ModifierProf';
lienSupprimer = '/SupprimerProf/:id';
lienGet = '/GetProf/:id';

pageErreur ='';
pageProfs = '';
pageProf = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienFindAll, function (req, res) {
    let Prof = mongoose.model('Prof');
    Prof.find().then((profs)=>{
        res.render(pageProfs, profs);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Prof = mongoose.model('Prof');
    let newProf = new Prof(req.body);
    newProf.id = newProf._id;

    newProf.save().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Prof').updateOne({id : req.body.id}, {$set : req.body}, (err, updatedProf)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienFindAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Prof = mongoose.model('Prof');
    Prof.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Prof').findOne({id : req.params.id}).then((prof)=>{
        if(prof){
            res.render(pageProf, prof);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});