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
    console.log("Seance - READ");
    
    Seance = mongoose.model('FIND ALL');
    Seance.find().then((seances)=>{
        res.send(seances);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

app.get(lienWeekOfClasse, function (req, res) {
    console.log("Seance - WeekOfClasse");
    
    Seance = mongoose.model('Seance');
    week = DaysOfWeek(req.body.semaine, req.body.annee);
    Seance.find({date:week,promo:{nom:req.body.classe}}).then((seances)=>{
        res.send(seances);
    },(err)=>{
        res.send("Erreur:" + err);
    })
});

// -- CREATE
app.post(lienAjouter, function (req, res) {
    console.log("Seance - CREATE");
    
    Seance = mongoose.model('Seance');

    newSeance = new Seance({type:req.body.type, heureDebut:req.body.heureDebut, heureFin:req.body.heureFin, date:req.body.date, salle:req.body.salle, eleve:req.body.eleve, promo:req.body.promo, prof:req.body.prof, matiere:req.body.matiere});

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
    
    var week = DaysOfWeek(req.params.week, req.params.year);
    mongoose.model('Seance').find({date : { $in: week }}).then((seances)=>{
        if(seances){
            res.send(seances);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.send("Erreur:" + err);
    });
});

function DaysOfWeek(sem, an){
    console.log("Seance - DaysOfWeek");
    
    var debut=new Date()
    debut.setUTCFullYear(an,0,1);
    var FirstDayOfYear= debut.getDay()
    var FirstBitLength=0
    if (FirstDayOfYear>4){
      FirstBitLength=  8-FirstDayOfYear
      }
   else {
        FirstBitLength=  FirstDayOfYear-7
      }
   
    adddays=(sem-1)*7+FirstBitLength+1
   
    var week = [];
    for(var i = 0; i < 7; i++){
        date = new Date()
        date.setFullYear(an,0,adddays + i)
        week.push(date.toLocaleString())
    }
    return week;
}

module.exports = app;