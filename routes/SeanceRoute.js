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
lienGetWeek = '/get/:year/:week';
lienWeekOfClasse = '/Classe/Week'

pageErreur ='';
pageSeances = '';
pageSeance = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    console.log("Seance - FIND ALL");
    
    Seance = mongoose.model('Seance');
    Seance.find().then((seances)=>{
        console.log("Seance - FIND ALL : " + seances);

        res.send(seances);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

app.get(lienWeekOfClasse, function (req, res) {
    console.log("Seance - WeekOfClasse");
    
    Seance = mongoose.model('Seance');
    Mondayweek = getDateOfISOWeek(req.body.semaine, req.body.annee);
    week = [];
    for(var i = 0; i < 7; i++){
        week.push(new Date(Mondayweek.getFullYear(), Mondayweek.getMonth(), Mondayweek.getDate()).toISOString().substring(0,10));
        Mondayweek.setDate(Mondayweek.getDate()+1);
    }
    console.log("Seance - WeekOfClasse:" + JSON.stringify(week));
    Seance.find({promo:{ nom:req.body.nom, alias:req.body.alias }}).then((seances)=>{
        seances = seances.filter(seance=> week.includes(seance.date.toISOString().substring(0,10)));

        res.send(seances);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

// -- CREATE
app.post(lienAjouter, function (req, res) {
    console.log("Seance - CREATE");
    
    Seance = mongoose.model('Seance');

    const dates = req.body.date.split("-");
    const date =new Date(dates[2], dates[1] - 1, dates[0]);
    console.log("date:"+ date);
    newSeance = new Seance({type:req.body.type, heureDebut:req.body.heureDebut, heureFin:req.body.heureFin, date:date, salle:req.body.salle, eleve:req.body.eleve, promo:req.body.promo, prof:req.body.prof, matiere:req.body.matiere});

    newSeance.save().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    console.log("Seance - UPDATE");
    
    mongoose.model('Seance').updateOne({_id : req.params.id}, {$set : req.body}, (err, updatedSeance)=>{
       if(err){
            res.send("Erreur:" + err);
       }else{
            res.send("Done");
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    console.log("Seance - DELETE");
    
    let Seance = mongoose.model('Seance');
    Seance.find({_id : new ObjectId(req.params.id)}).deleteOne().then(()=>{
        res.send("Done");
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    console.log("Seance - READ");
    
    mongoose.model('Seance').findOne({_id : new ObjectId(req.params.id)}).then((seance)=>{
        if(seance){
            res.send(seance);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

app.get(lienGetWeek, function (req, res) {
    console.log("Seance - GetWeek");
    
    var Mondayweek = getDateOfISOWeek(req.params.week, req.params.year);
    week = [];
    for(var i = 0; i < 7; i++){
        week.push(new Date(Mondayweek.getFullYear(), Mondayweek.getMonth(), Mondayweek.getDate()).toISOString().substring(0,10));
        Mondayweek.setDate(Mondayweek.getDate()+1);
    }
    console.log("Seance - WeekOfClasse:" + JSON.stringify(week));
    mongoose.model('Seance').find().then((seances)=>{
        if(seances){
            seances = seances.filter(seance=> week.includes(seance.date.toISOString().substring(0,10)));
            res.send(seances);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

function getDateOfISOWeek(w, y) {
    console.log("Seance - DateOfISOWeek");

    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

module.exports = app;