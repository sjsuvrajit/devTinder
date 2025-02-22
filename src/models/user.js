const mongoose = require('mongoose');

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
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
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
        default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
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

module.exports = mongoose.model("User", userSchema);