const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try{
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('MongoDB connected');
    });
    }
    catch(error){
        console.log('Error connecting to DB');
    }
}
module.exports = connectDB;