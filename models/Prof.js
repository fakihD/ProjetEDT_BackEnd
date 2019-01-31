//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let ProfSchema = new Schema({
    nom : String,
    prenom : String,
    alias : String,
    promo : [
        {
            nom : String,
            alias : String
        }

    ],

    matiere : [
        {
            nom : String,
            alias : String
        }

    ]
});

let Prof = mongoose.model('Prof', ProfSchema);

module.exports = Prof;