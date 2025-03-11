const validator = require("validator");

const validateSignUpData = async(req) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName) {
        throw new Error("Name is not valid!");
    }
    else if(!validator.isEmail(email)) {
        throw new Error("Email is not valid!");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a storng password!");
    }
}

const validateUserProfileEditData = (req) => {

    const allowedEditFields = [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "about",
        "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateUserProfileEditData
}