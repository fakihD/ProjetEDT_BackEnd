//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let MatiereSchema = new Schema({
    nom : String,
    alias : String,
    prof :[ {
        nomp : String,
        prenom : String,
        alias : String
    }]
});

let Matiere = mongoose.model('Matiere', MatiereSchema);
module.exports = Matiere;