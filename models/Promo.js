//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let PromoSchema = new Schema({
    id : Number,
    nom : String,
    alias : String
});

mongoose.model('Promo', PromoSchema);