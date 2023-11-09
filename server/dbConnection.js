//require('dotenv').config();
// ConnectDB function for connecting to MongoDB database
const mongoose = require("mongoose");

//Async since connection could take a while
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            dbName: 'PayloadImages',
            //Parameters above for removing MongoDB errors
        });
        
        
    } catch (error) {
        console.error(error);
    }
}
//Exporting the module to be called by index.js
module.exports = connectDB;