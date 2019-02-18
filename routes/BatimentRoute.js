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
    Batiment = mongoose.model('Batiment');
    Batiment.find().then((batiments)=>{
        res.render(pageBatiments, batiments);
    },(err)=>{
        res.redirect(lienErreur);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    Batiment = mongoose.model('Batiment');
    newBatiment = new Batiment({libelle:req.body.libelle, adresse:req.body.adresse, salle:req.body.salle});

    newBatiment.save().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Batiment').updateOne({id : req.params.id}, {$set : req.body}, (err, updatedBatiment)=>{
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
    Batiment.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Batiment').findOne({_id : new ObjectId(req.params.id)}).then((batiment)=>{
        if(batiment){
            res.render(pageBatiment, batiment);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;