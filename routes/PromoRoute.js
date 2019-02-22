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
require('../models/Promo');

lienErreur = '/error';
lienAll = '/';
lienAjouter = '/add';
lienModifier = '/update/:id';
lienSupprimer = '/delete/:id';
lienGet = '/get/:id';

pageErreur ='';
pagePromos = '';
pagePromo = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    console.log("Promo - FIND ALL");
    
    Promo = mongoose.model('Promo');
    Promo.find().then((promos)=>{
        res.send(promos);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    console.log("Promo - CREATE");
    
    Promo = mongoose.model('Promo');
    newPromo = new Promo({nom:req.body.nom, alias:req.body.alias});

    newPromo.save().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    console.log("Promo - UPDATE");
    
    mongoose.model('Promo').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedPromo)=>{
       if(err){
            res.send("Erreur:" + err);
       }else{
            res.send("Done");
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    console.log("Promo - DELETE");
    
    let Promo = mongoose.model('Promo');
    Promo.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    console.log("Promo - READ");
    
    mongoose.model('Promo').findOne({_id : new ObjectId(req.params.id)}).then((promo)=>{
        if(promo){
            res.send(promo);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

module.exports = app;