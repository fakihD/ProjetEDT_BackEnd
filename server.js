// ---- MANAGE DATABASE
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

mongoose.connect("mongodb://localhost/EDT",{
    useNewUrlParser: true
}).then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

const app = express();

//Body Parser
let urlencodedParser = bodyParser.urlencoded({
    extended: true,
});
app.use(urlencodedParser);
app.use(bodyParser.json());

//Définition des CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/profs',require('./routes/ProfRoute'));
app.use('/batiments',require('./routes/BatimentRoute'));
app.use('/eleves',require('./routes/EleveRoute'));
app.use('/matieres',require('./routes/MatiereRoute'));
app.use('/promos',require('./routes/PromoRoute'));
app.use('/salles',require('./routes/SalleRoute'));
app.use('/seances',require('./routes/SeanceRoute'));


app.listen(3010);
console.log("C'est en marche !");