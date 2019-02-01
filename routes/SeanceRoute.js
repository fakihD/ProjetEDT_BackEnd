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
require('../models/Seance');

lienErreur = '/error';
lienAll = '/seances/';
lienAjouter = '/seances';
lienModifier = '/seances';
lienSupprimer = '/seances/:id';
lienGet = '/seances/:id';

pageErreur ='';
pageSeances = '';
pageSeance = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    let Seance = mongoose.model('Seance');
    Seance.find().then((seances)=>{
        res.render(pageSeances, seances);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Seance = mongoose.model('Seance');
    let newSeance = new Seance(req.body);
    newSeance.id = newSeance._id;

    newSeance.save().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Seance').updateOne({id : req.body.id}, {$set : req.body}, (err, updatedSeance)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Seance = mongoose.model('Seance');
    Seance.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Seance').findOne({id : req.params.id}).then((seance)=>{
        if(seance){
            res.render(pageSeance, seance);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;