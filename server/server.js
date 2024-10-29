const express = require('express');
const cors = require('cors');
require('dotenv').config();
//import cors from 'cors'

const app = express();
app.use(cors());
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

const ticketRouter = require('./routes/ticket');
app.use('/ticket', ticketRouter);

const customerTicketRouter = require('./routes/customer_ticket');
app.use('/customer_ticket', customerTicketRouter);

const productRouter = require('./routes/product');
app.use('/product', productRouter);

const customerProductRouter = require('./routes/customer_product');
app.use('/customer_product', customerProductRouter);

const productCategoryRouter = require('./routes/product_category');
app.use('/product_category', productCategoryRouter);

const reviewRouter = require('./routes/review');
app.use('/review', reviewRouter);

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