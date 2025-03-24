const express = require("express");
const userRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = "firstName lastName about photoUrl skills age gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedinUser,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        return res.status(200).json({
            message: "All Requests",
            data: connectionRequests
        })

    } catch (err) {
        return res.status(400).send("Error: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {
        const loggedinUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedinUser._id, status: "accepted"},
                {fromUserId: loggedinUser._id, status: "accepted"},
            ]
        }).populate("toUserId", USER_SAFE_DATA).populate("fromUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if(row.toUserId.equals(loggedinUser)) {
                return row.fromUserId
            } else return row.toUserId;
        })

        return res.status(200).json({
            message: "All Connections",
            data: data
        });
    } catch (err) {
        return res.status(400).send("Error: " + err.message);
    }
})

module.exports = userRouter;

