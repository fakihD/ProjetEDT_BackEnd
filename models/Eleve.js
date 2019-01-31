//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let EleveSchema = new Schema({
    nom : String,
    prenom : String,
    alias : String,
    promo : [
        {
            nom : String,
            alias : String
        }

    ]
    
});

let Eleve = mongoose.model('Eleve', EleveSchema);

module.exports = Eleve;