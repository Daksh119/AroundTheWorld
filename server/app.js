const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const placeRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');
require('dotenv').config();
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})

app.use('/api/places', placeRoutes);
app.use('/api/users',userRoutes);

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) =>{
    const error = new HttpError('could not find this route',404);
    throw error;
})

app.use((error,req,res,next) => {
    if (req.file) {
        fs.unlink(req.file.path, (error) => console.log(error));
    }

    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || 'an unknown error has occurred'});
})


mongoose.connect(process.env.MONGODB_URL).then(() => {
    app.listen(process.env.PORT || 5000);
    console.log('Mongodb connected');
}).catch(err => {
    console.log(err);
})

