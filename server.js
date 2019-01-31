// ---- MANAGE DATABASE
let mongoose = require('mongoose');

let database  = mongoose.connect("mongodb://localhost/EDT",{
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

const app = express();

app.use('/prof',require('./routes/ProfRoute'));

app.listen(3010);