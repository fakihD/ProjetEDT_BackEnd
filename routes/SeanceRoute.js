express = require('express'),
app = express();
session = require('cookie-session');

// --- middleware
// - body-parser needed to catch and to treat information inside req.body
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({secret: 'todotopsecret'}))

// -- Load model needed for the project
require('../models/Seance');

lienErreur = '/error';
lienAll = '/';
lienAjouter = '/add';
lienModifier = '/update/:id';
lienSupprimer = '/delete/:id';
lienGet = '/get/:id';
lienGetWeek = '/get/:year/:week';

pageErreur ='';
pageSeances = '';
pageSeance = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    res.render(pageErreur);
})

// -- FIND ALL
app.get(lienAll, function (req, res) {
    let Seance = mongoose.model('Seance');
    Seance.find().then((seances)=>{
        res.render(pageSeances, seances);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Seance = mongoose.model('Seance');
    let newSeance = new Seance(req.body);
    newSeance.id = newSeance._id;

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
    Seance.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Seance').findOne({id : req.params.id}).then((seance)=>{
        if(seance){
            res.render(pageSeance, seance);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});
app.get(lienGetWeek, function (req, res) {
    var week = DaysOfWeek(req.params.week, req.params.year);
    mongoose.model('Seance').find({date : { $in: week }}).then((seances)=>{
        if(seances){
            res.render(pageSeance, seances);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

function DaysOfWeek(sem, an){
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