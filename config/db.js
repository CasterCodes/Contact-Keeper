const mongoose = require('mongoose');
const config = require('config')
const db = config.get('mongoURL')
const connectDB = () => {
       mongoose.connect(db, {
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false,
            useUnifiedTopology:true
       })
       .then(() => console.log('Connected'))
       .catch(error => {
           console.log(error)
           process.exit(1)
        })
     
}
module.exports = connectDB