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
    Matiere = mongoose.model('Matiere');
    Matiere.find().then((matieres)=>{
        res.render(pageMatieres, matieres);
    },(err)=>{
        res.redirect(lienErreur);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    Matiere = mongoose.model('Matiere');

    newMatiere = new Matiere({nom:req.body.nom, alias:req.body.alias, prof:req.body.prof});

    newMatiere.save().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Matiere').updateOne({id : req.params.id}, {$set : req.body}, (err, updatedMatiere)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Matiere = mongoose.model('Matiere');
    Matiere.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Matiere').findOne({_id : new ObjectId(req.params.id)}).then((matiere)=>{
        if(matiere){
            res.render(pageMatiere, matiere);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;