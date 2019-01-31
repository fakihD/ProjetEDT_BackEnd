//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let SalleSchema = new Schema({
    libelle : String,
    batiment : [
        {
            libelle : String,
            adresse : String
        }

    ]
    
});

let Salle = mongoose.model('Salle', SalleSchema);

module.exports = Salle;