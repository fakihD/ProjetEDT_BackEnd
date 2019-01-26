// ---- EXPRESS JS - Framework

let express = require('express'),
    app = express();

// --- middleware
// - body-parser needed to catch and to treat information inside req.body
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
// -- Load model needed for the project
require('./Burger');

// -- FIND ALL
app.get('/burgers', function (req, res) {
    let Burger = mongoose.model('Burger');
    Burger.find().then((burgers)=>{
        res.status(200).json(burgers)
    })
});
// -- CREATE
app.post('/burgers', function (req, res) {
    let Burger = mongoose.model('Burger');
    let newBurger = new Burger(req.body);
    newBurger.id = newBurger._id;

    newBurger.save().then(()=>{
        res.status(200).json(newBurger)
    },(err)=>{
        res.status(400).json(err);
    })
});

// -- DELETE
app.delete('/burgers/:id', function (req, res) {
    let Burger = mongoose.model('Burger');
    Burger.find({id : req.params.id}).deleteOne().then(()=>{
        res.status(204).json()
    },(err)=>{
        res.status(400).json(err);
    });
});
// -- UPDATE
app.put('/burgers/:id', function (req, res) {
    mongoose.model('Burger').updateOne({id : req.params.id}, {$set : req.body}, (err, updatedBurger)=>{
       if(err){
           res.status(400).json(err);
       }else{
           res.status(200).json(updatedBurger)
       }
    });
});
// -- READ
app.get('/burgers/:id', function (req, res) {
    mongoose.model('Burger').findOne({id : req.params.id}).then((burger)=>{
        if(burger){
            res.status(200).json(burger)
        }else{
            res.status(404).json({message : "Not Found"})
        }
    },(err)=>{
        res.status(400).json(err)
    });
});