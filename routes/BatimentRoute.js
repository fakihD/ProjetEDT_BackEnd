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
    console.log("Batiment - FIND ALL");

    Batiment = mongoose.model('Batiment');
    Batiment.find().then((batiments)=>{
        res.send(batiments);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    console.log("Batiment - CREATE");
    
    Batiment = mongoose.model('Batiment');
    newBatiment = new Batiment({libelle:req.body.libelle, adresse:req.body.adresse, salle:req.body.salle});

    newBatiment.save().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    console.log("Batiment - UPDATE");
    
    mongoose.model('Batiment').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedBatiment)=>{
       if(err){
            res.send("Erreur:" + err);
       }else{
            res.send("Done");
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    console.log("Batiment - DELETE");
    
    let Batiment = mongoose.model('Batiment');
    Batiment.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    console.log("Batiment - READ");
    
    mongoose.model('Batiment').findOne({_id : new ObjectId(req.params.id)}).then((batiment)=>{
        if(batiment){
            res.send(batiment);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

module.exports = app;