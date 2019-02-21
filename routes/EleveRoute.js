express = require('express');
mongoose = require('mongoose');
bodyParser = require('body-parser');

ObjectId = mongoose.Types.ObjectId;
app = express();

// --- middleware
// - body-parser needed to catch and to treat information inside req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// -- Load model needed for the project
require('../models/Eleve');

lienErreur = '/error';
lienAll = '/';
lienAjouter = '/add';
lienModifier = '/update/:id';
lienSupprimer = '/delete/:id';
lienGet = '/get/:id';

pageErreur ='';
pageEleves = '';
pageEleve = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    console.log("Eleve - FIND ALL");
    
    Eleve = mongoose.model('Eleve');
    Eleve.find().then((eleves)=>{
        res.send(eleves);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    console.log("Eleve - CREATE");
    
    Eleve = mongoose.model('Eleve');

    newEleve = new Eleve({nom:req.body.nom, prenom:req.body.prenom, alias:req.body.alias, promo:req.body.promo});

    newEleve.save().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    console.log("Eleve - UPDATE");
    
    mongoose.model('Eleve').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedEleve)=>{
       if(err){
            res.send("Erreur:" + err);
       }else{
            res.send("Done");
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    console.log("Eleve - DELETE");
    
    let Eleve = mongoose.model('Eleve');
    Eleve.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    console.log("Eleve - READ");
    
    mongoose.model('Eleve').findOne({_id : new ObjectId(req.params.id)}).then((eleve)=>{
        if(eleve){
            res.send(eleve);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

module.exports = app;