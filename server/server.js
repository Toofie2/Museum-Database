const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Backend routes for each table
const employeeRouter = require('./routes/employee');
app.use('/employee', employeeRouter);

const customerRouter = require('./routes/customer');
app.use('/customer', customerRouter);

const authenticationRouter = require('./routes/authentication');
app.use('/authentication', authenticationRouter);

const customer_exhibitionRouter = require('./routes/customer_exhibition');
app.use('/customer_exhibition', customer_exhibitionRouter);

const roomRouter = require('./routes/room');
app.use('/room', roomRouter);

const exhibitionRouter = require('./routes/exhibition');
app.use('/exhibition', exhibitionRouter);

const reviewRouter = Require('.routes/review');
app.use('/review', reviewRouter);

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});

app.listen(port, () => {
    console.log(`Connected to backend on port ${port}`);
});