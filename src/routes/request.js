const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');


requestRouter.post("/sendConnectionRequest", userAuth, async(req, res)=> {
    const user = req.user;
    console.log("Connection request called");

    res.send(user.firstName + " sent connection request");
})


module.exports = requestRouter;