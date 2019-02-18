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
require('../models/Seance');

lienErreur = '/error';
lienAll = '/';
lienAjouter = '/add';
lienModifier = '/update/:id';
lienSupprimer = '/delete/:id';
lienGet = '/get/:id';

pageErreur ='';
pageSeances = '';
pageSeance = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    Seance = mongoose.model('Seance');
    Seance.find().then((seances)=>{
        res.render(pageSeances, seances);
    },(err)=>{
        res.redirect(lienErreur);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    Seance = mongoose.model('Seance');

    newSeance = new Seance({type:req.body.type, heureDebut:req.body.heureDebut, heureFin:req.body.heureFin, date:req.body.date, salle:req.body.salle, eleve:req.body.eleve, promo:req.body.promo, prof:req.body.prof, matiere:req.body.matiere});

    newSeance.save().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Seance').updateOne({id : req.params.id}, {$set : req.body}, (err, updatedSeance)=>{
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
    Seance.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Seance').findOne({_id : new ObjectId(req.params.id)}).then((seance)=>{
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