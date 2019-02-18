//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let SeanceSchema = new Schema({
    type : String,
    heureDebut : String,
    heureFin : String,
    date : String,
    salle :{
        libelle : String
    },
    eleve : [{
        nom : String,
        prenom : String
    }],
    promo : {
        nom : String,
        alias : String
    },
    prof : {
        nom : String,
        prenom : String
    },
    matiere : {
        nom : String,
        alias : String
    }


});

let Seance = mongoose.model('Seance', SeanceSchema);
module.exports = Seance;