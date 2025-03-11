const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validateUserProfileEditData } = require("../utils/validations");


//get user profile
profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if(!validateUserProfileEditData(req)) {
            throw new Error("Invalid Data!");
        }

        const loggedinUser = req.user;

        Object.keys(req.body).forEach(field => loggedinUser[field] = req.body[field]);

        loggedinUser.save();

        res.json({
            message: `${loggedinUser.firstName}, your profile has been updated successfully`,
            data: loggedinUser
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})



module.exports = profileRouter;