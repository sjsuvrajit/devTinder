const express = require('express');
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    // methods: ['get','POST','PUT','PATCH','DELETE','OPTIONS'],
    //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/user"));


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






