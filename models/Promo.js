//--- Module dependencies
const mongoose 	= require('mongoose'),
    Schema	 	= mongoose.Schema;

//------------------------------------------- Resources Schema
let PromoSchema = new Schema({

     nom : String,
     alias : String
     
});

let Promo = mongoose.model('Promo', PromoSchema);

module.exports = Promo;