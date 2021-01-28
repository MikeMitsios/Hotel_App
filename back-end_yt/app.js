const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const fs = require('fs'); 
// const path = require('path'); 
// require('dotenv/config'); 

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const apartRoutes = require('./api/routes/apartments');
const reservRoutes = require('./api/routes/reservation');
const reviewRoutes = require('./api/routes/review');
const adminRoutes = require('./api/routes/admin');
const chatRoutes = require('./api/routes/chat');




mongoose.connect('mongodb+srv://admin:'+ 
    process.env.MONGO_ATLAS_PW +
    '@ted.olupu.mongodb.net/TED?retryWrites=true&w=majority',
    { useNewUrlParser: true,useUnifiedTopology: true }
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with , Content-Type, Accept,Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});
//Routes

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);
app.use('/apartments',apartRoutes);
app.use('/reservation',reservRoutes);
app.use('/review',reviewRoutes);
app.use('/admin',adminRoutes);
app.use('/chat',chatRoutes);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;