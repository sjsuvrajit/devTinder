const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is not correct`
        }
    }
}, { timestamps: true });


//Indexing -- Used for faster query from Database
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1});
//This is called compound Indexing

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Invalid Request");
    }

    next();
})

const connectionRequestModel = new mongoose.model("Connectionrequest", connectionRequestSchema);

module.exports = connectionRequestModel;