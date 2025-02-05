const express = require('express');

const app = express();

app.use('/test',(req, res) => {
    res.send('Hello from DevTinder Test');
});

app.use('/namaste', (req, res) => {
    res.send('Namaste from DevTinder');
});

app.use('/', (req, res) => {
    res.send('Hello from DevTinder');
});




app.listen(7777, () => {
    console.log('Server is up and running on Port 7777');
});


