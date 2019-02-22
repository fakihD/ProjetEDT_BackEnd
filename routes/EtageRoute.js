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
require('../models/Etage');

lienErreur = '/error';
lienAll = '/';
lienAjouter = '/add';
lienModifier = '/update/:id';
lienSupprimer = '/delete/:id';
lienGet = '/get/:id';

pageErreur ='';
pageEtages = '';
pageEtage = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    console.log("Etage - FIND ALL");
    
    Etage = mongoose.model('Etage');
    Etage.find().then((etages)=>{
        res.send(etages);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    console.log("Etage - CREATE");
    
    Etage = mongoose.model('Etage');
    newEtage = new Etage({});

    newEtage.save().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    console.log("Etage - UPDATE");
    
    mongoose.model('Etage').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedEtage)=>{
       if(err){
            res.send("Erreur:" + err);
       }else{
            res.send("Done");
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    console.log("Etage - DELETE");
    
    let Etage = mongoose.model('Etage');
    Etage.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    console.log("Etage - READ");
    
    mongoose.model('Etage').findOne({_id : new ObjectId(req.params.id)}).then((etage)=>{
        if(etage){
            res.send(etage);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

module.exports = app;