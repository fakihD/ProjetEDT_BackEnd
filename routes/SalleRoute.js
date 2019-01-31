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
require('../models/Salle');

let lienErreur = '/error';
let lienFindAll = '/salles';
let lienAjouter = '/salles';
let lienModifier = '/salles/:id';
let lienSupprimer = '/salles/:id';
let lienGet = '/salles/:id';

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
        res.render(pageSalle, salles);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Salle = mongoose.model('Salle');
    let newSalle = new Salle(req.body);
    newSalle.id = newSalle._id;

    newSalle.save().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Salle').updateOne({id : req.body.id}, {$set : req.body}, (err, updatedSalle)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienFindAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Salle = mongoose.model('Salle');
    Salle.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Salle').findOne({id : req.params.id}).then((salle)=>{
        if(salle){
            res.render(pageSalle, salle);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});