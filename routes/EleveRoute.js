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
require('../models/Eleve');

lienErreur = '/error';
lienAll = '/eleves/';
lienAjouter = '/eleves/add';
lienModifier = '/eleves/update/:id';
lienSupprimer = '/eleves/delete/:id';
lienGet = '/eleves/get/:id';

pageErreur ='';
pageEleves = '';
pageEleve = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    let Eleve = mongoose.model('Eleve');
    Eleve.find().then((eleves)=>{
        res.render(pageEleves, eleves);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Eleve = mongoose.model('Eleve');
    let newEleve = new Eleve(req.body);
    newEleve.id = newEleve._id;

    newEleve.save().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Eleve').updateOne({id : req.params.id}, {$set : req.body}, (err, updatedEleve)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Eleve = mongoose.model('Eleve');
    Eleve.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Eleve').findOne({id : req.params.id}).then((eleve)=>{
        if(eleve){
            res.render(pageEleve, eleve);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;