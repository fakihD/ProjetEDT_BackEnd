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
require('../models/Etage');

let lienErreur = '/error';
let lienFindAll = '/';
let lienAjouter = '/add';
let lienModifier = '/update/:id';
let lienSupprimer = '/delete/:id';
let lienGet = '/get/:id';

let pageErreur ='';
let pageEtage = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    console.log("error");
})

// -- FIND ALL
app.get(lienFindAll, function (req, res) {
    let Etage = mongoose.model('Etage');
    Etage.find().then((etages)=>{
        res.render(pageEtage, etages);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let etage = mongoose.model('Etage');
    let newEtage = new Etage(req.body);
    newEtage.id = newEtage._id;

    newEtage.save().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Etage').updateOne({id : req.params.id}, {$set : req.body}, (err, updatedEtage)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienFindAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Etage = mongoose.model('Etage');
    Etage.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Etage').findOne({id : req.params.id}).then((etage)=>{
        if(etage){
            res.render(pageEtage, etage);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;