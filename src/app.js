const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

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
    const user = new User(req.body);
    
    try {
        await user.save();
        res.send("User Added successfully");
    } catch (err) {
        res.status(400).send("Error while adding user:" + err.message);
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






