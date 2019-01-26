// ---- MANAGE DATABASE
let mongoose = require('mongoose');

let database  = mongoose.connect("mongodb://localhost/EDT",{
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true
});