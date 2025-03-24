const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=> {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
    
        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            throw new Error("Invalid status");
        }
        
        //check for valid User
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            throw new Error("User does not exsists");
        }
        //check connection request is already present or not
        const checkConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(checkConnectionRequest) {
            throw new Error("Connection request has been sent already!");
        }

        const data = new ConnectionRequest({
            fromUserId, toUserId, status
        }
        )

        await data.save();

        return res.status(200).json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })
    } catch (err) {
        return res.status(400).send("Error: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try {
        const loggedinUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
            throw new Error("Invalid Status");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedinUser,
            status: "interested"
        });

        if(!connectionRequest) {
            throw new Error("Invalid Request");
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        return res.status(200).json({
            message: "Connection Request " + status,
            data
        })
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})


module.exports = requestRouter;