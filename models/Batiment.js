//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let BatimentSchema = new Schema({
    libelle : String,
    adresse : String,
    salle :[ {
        libelle : String
    }]
});

let Batiment = mongoose.model('Batiment', BatimentSchema);
module.exports = Batiment;