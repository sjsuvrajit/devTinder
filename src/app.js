const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

//get an user
app.get("/user", async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Somthing went wrong");
    }
})

//get all user for Feed
app.get("/feed", async(req, res) => {
    try {
        const users = await User.find();
        if(users.length === 0) {
            res.status(404).send("Users not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Somthing went wrong");
    }
})

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

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(isPasswordMatched) {

            //create JWT token
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder$123");
            //set token to the cookie
            res.cookie("token", token);
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
app.get("/profile", async(req, res) => {
    try {
        const { token } = await req.cookies;
        if(!token) {
            throw new Error("Invalid Token");
        }

        //verify token
        const decodedToken = await jwt.verify(token, "DEV@Tinder$123");
        
        const user = await User.findById(decodedToken._id);
        if(!user) {
            throw new Error("Invalid token");
        }

        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

//update user
app.patch("/user/:userId", async(req, res) => {
    try {
        const userId = req?.params.userId;
        //const email = req.body.email;
        const data = req.body;

        const ALLOWED_UPDATES = ["photoUrl", "about", "age", "gender", "skills"];

        const isAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
        if(!isAllowed) {
            throw new Error("Invalid updates!")
        }

        if(data?.skills.length > 10) {
            throw new Error("Skills can't be more than 10");
        }

        const user = await User.findByIdAndUpdate(userId, data, 
            {runValidators: true}
        );
        //const user = await User.findOneAndUpdate({ email: email}, data, { runValidators: true})

        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Error while updating user: " + err.message);
    }
})

//delete user
app.delete("/user", async(req, res) => {
    try {
        const userId = req.body.userId;

        await User.findByIdAndDelete(userId);

        res.send("User deleted successfully");
        
    } catch (err) {
        res.status(400).send("Somthing went wrong");
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
        console.log("Database connection failed. Exiting now...", err);
    })






