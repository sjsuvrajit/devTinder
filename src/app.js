const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Suvrajit",
        lastName: "Ghosh",
        email: "sj.suvrajit.sg@gmail.com",
        age: 27,
    }
    
    try {
        const user = new User(userObj);
        await user.save();
        res.send("User Added successfully");
    } catch (err) {
        res.status(400).send("Error while adding user. Try again later.");
    }
})

connectDB()
    .then(() => {
        console.log("Database connected successfully!");

        //listing to server
        app.listen(7777, () => {
            console.log('Server is up and running on Port 7777');
        });
    }).catch((err) => {
        console.log("Database connection failed. Exiting now...");
    })






