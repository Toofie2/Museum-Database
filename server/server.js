const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes that 
const employeesRouter = require('./routes/employees');
app.use('/employees', employeesRouter);

const ticketRouter = require('./routes/ticket');
app.use('/ticket', ticketRouter);

const customerTicketRouter = require('./routes/customer-ticket.js');
app.use('/customer-ticket', customerTicketRouter);

const productRouter = require('./routes/product');
app.use('/product', productRouter);

const customerProductRouter = require('./routes/customer-product.js');
app.use('/customer-product', customerProductRouter);

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});

app.listen(port, () => {
    console.log(`Connected to backend on port ${port}`);
});