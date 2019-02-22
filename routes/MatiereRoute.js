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
require('../models/Matiere');

lienErreur = '/error';
lienAll = '/';
lienAjouter = '/add';
lienModifier = '/update/:id';
lienSupprimer = '/delete/:id';
lienGet = '/get/:id';

pageErreur ='';
pageMatieres = '';
pageMatiere = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    console.log("Matiere - FIND ALL");
    
    Matiere = mongoose.model('Matiere');
    Matiere.find().then((matieres)=>{
        res.send(matieres);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    console.log("Matiere - CREATE");
    
    Matiere = mongoose.model('Matiere');

    newMatiere = new Matiere({nom:req.body.nom, alias:req.body.alias, prof:req.body.prof});

    newMatiere.save().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    console.log("Matiere - UPDATE");
    
    mongoose.model('Matiere').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedMatiere)=>{
       if(err){
            res.send("Erreur:" + err);
       }else{
            res.send("Done");
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    console.log("Matiere - DELETE");
    
    let Matiere = mongoose.model('Matiere');
    Matiere.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    console.log("Matiere - READ");
    
    mongoose.model('Matiere').findOne({_id : new ObjectId(req.params.id)}).then((matiere)=>{
        if(matiere){
            res.send(matiere);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

module.exports = app;