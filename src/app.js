const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());



app.post("/signup", async (req, res) => {
    try {
        //validate request
        validateSignUpData(req);

        const { firstName, lastName, email, password } = req.body;
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, email, password: passwordHash
    });
    
    
        await user.save();
        res.send("User Added successfully");
    } catch (err) {
        res.status(400).send("Error while adding user:" + err.message);
    }
})

app.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body;
        
        const user = await User.findOne({email});
        if(!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordMatched = await user.validatePassword(password);
        if(isPasswordMatched) {
            //create JWT token
            const token = await user.getJWT();
            //set token to the cookie
            res.cookie("token", token, {expires: new Date(Date.now() + 24 * 3600000)});
            res.status(200).send("Login Successful!!");
        }
        else {
            throw new Error("Invalid Credentials");
        }
    } catch (err) {
        res.status(400).send("Error : " + err.message);
        
    }
})

//get user profile
app.get("/profile", userAuth, async(req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async(req, res)=> {
    const user = req.user;
    console.log("Connection request called");

    res.send(user.firstName + " sent connection request");
})


connectDB()
    .then(() => {
        console.log("Database connected successfully!");

        //listing to server
        app.listen(7777, () => {
            console.log('Server is up and running on Port 7777');
        });
    }).catch((err) => {
        console.log("Database connection failed. Exiting now...", err);
    })






