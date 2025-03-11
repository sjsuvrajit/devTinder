const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 50,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is not valid: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Photo URL is not valid: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "Hey Alians! I am using DevTinder"
    },
    skills:{
        type: [String],
    }
},
{
    timestamps: true,
}
);


userSchema.methods.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$123", {expiresIn: "7d"});

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);