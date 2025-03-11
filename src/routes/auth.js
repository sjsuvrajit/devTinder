const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    //validate request
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error while adding user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatched = await user.validatePassword(password);
    if (isPasswordMatched) {
      //create JWT token
      const token = await user.getJWT();
      //set token to the cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000),
      });
      res.status(200).send("Login Successful!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logged out successfully");
});

module.exports = authRouter;
