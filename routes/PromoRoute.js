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
require('../models/Promo');

let lienErreur = '/error';
let lienFindAll = '/promos';
let lienAjouter = '/promos/add';
let lienModifier = '/promos/update/:id';
let lienSupprimer = '/promos/delete/:id';
let lienGet = '/promos/get/:id';

let pageErreur ='';
let pagePromo = '';

// -- ERROR
app.get(lienErreur, function(req, res) {
    console.log("error");
})

// -- FIND ALL
app.get(lienFindAll, function (req, res) {
    let Promo = mongoose.model('Promo');
    Promo.find().then((promos)=>{
        res.render(pagePromo, promos);
    })
});
// -- CREATE
app.post(lienAjouter, function (req, res) {
    let Promo = mongoose.model('Promo');
    let promo1 = new Promo(req.body);
    promo1.id = promo1._id;

    promo1.save().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.redirect(lienErreur);
    })
});

// -- UPDATE
app.put(lienModifier, function (req, res) {
    mongoose.model('Promo').updateOne({id : req.params.id}, {$set : req.body}, (err, updatedPromo)=>{
       if(err){
            res.redirect(lienErreur);
       }else{
            res.redirect(lienFindAll);
       }
    });
});

// -- DELETE
app.delete(lienSupprimer, function (req, res) {
    let Promo = mongoose.model('Promo');
    Promo.find({id : req.params.id}).deleteOne().then(()=>{
        res.redirect(lienFindAll);
    },(err)=>{
        res.redirect(lienErreur);
    });
});

// -- READ
app.get(lienGet, function (req, res) {
    mongoose.model('Promo').findOne({id : req.params.id}).then((promo)=>{
        if(promo){
            res.render(pagePromo, promo);
        }else{
            res.status(404).json({message : "Inexistant"});
        }
    },(err)=>{
        res.redirect(lienErreur);
    });
});

module.exports = app;