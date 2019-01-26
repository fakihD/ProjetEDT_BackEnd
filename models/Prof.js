//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let ProfSchema = new Schema({
    id : String,
    nom : String,
    prenom : String,
    alias : String,
    promo : Array,
    matiere : Array
});

mongoose.model('Prof', ProfSchema);