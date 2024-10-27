const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Backend routes for each table
const employeeRouter = require('./routes/employee');
app.use('/employee', employeeRouter);

const customer_exhibitionRouter = require('./routes/customer_exhibition');
app.use('/customer_exhibition', customer_exhibitionRouter);

const roomRouter = require('./routes/room');
app.use('/room', roomRouter);

const exhibitionRouter = require('./routes/exhibition');
app.use('/exhibition', exhibitionRouter);

const artRouter = require('./routes/art');
app.use('/art', artRouter);

const artistRouter = require('./routes/artist');
app.use('/artist', artistRouter);

const collectionRouter = require('./routes/collection');
app.use('/collection', collectionRouter);

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});

app.listen(port, () => {
    console.log(`Connected to backend on port ${port}`);
});