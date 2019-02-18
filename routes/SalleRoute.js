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
require('../models/Salle');

lienErreur = '/error';
lienAll = '/';
lienAjouter = '/add';
lienModifier = '/update/:id';
lienSupprimer = '/delete/:id';
lienGet = '/get/:id';

pageErreur ='';
pageSalles = '';
pageSalle = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    Salle = mongoose.model('Salle');
    Salle.find().then((salles)=>{
        res.render(pageSalles, salles);
    },(err)=>{
        res.redirect(lienErreur);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    Salle = mongoose.model('Salle');
    newSalle = new Salle({libelle:req.body.libelle, batiment:req.body.batiment});

    newSalle.save().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Salle').updateOne({id : req.params.id}, {$set : req.body}, (err, updatedSalle)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Salle = mongoose.model('Salle');
    Salle.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Salle').findOne({_id : new ObjectId(req.params.id)}).then((salle)=>{
        if(salle){
            res.render(pageSalle, salle);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;