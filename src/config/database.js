const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://sjsuvrajit:openitsj%401998@devtinder.9mjop.mongodb.net/devTinder");
}

module.exports = connectDB;