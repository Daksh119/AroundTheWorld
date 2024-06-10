const fs = require('fs');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');
const getCoordinatesFromAddress = require("../util/location");
const getImage = require("../util/image.js");


const getPlaceById = async (req,res,next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch(err) {
        const error = new HttpError('something went wrong', 500);
        return next(error);
    }
    
    if(!place){
        const error = new HttpError('could not find a place', 404);
        return next(error);
    }
    res.json({place: place.toObject( {getters: true})});
}

const getPlacesByUser = async (req,res,next) => {
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find( {creator: userId});
    } catch(err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    if(!places || places.length === 0){
        return next(new HttpError('No places of this Id exist', 404));
    }

    res.json({places: places.map(place => place.toObject({getters: true}))});
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
    console.log("create");
    const {title , description, address} = req.body;

    // console.log("ssss",title , description, address,req.body) 
    let coordinates;

    try {
        coordinates = await getCoordinatesFromAddress(address);
    } catch (error) {
        return next(error);
    }
    let img;
    try {
        img = await getImage(title);
    } catch (error) {
        return next(error);
    }
    
    const createdPlace = new Place({
        title,
        description,
        address,
        location:coordinates,
        image: img,
        creator: req.userData.userId
    })

    let user;
    try {
        user = await User.findById(req.userData.userId);
        
    } catch(err) {
        const error = new HttpError('Creating place failed',500);
        return next(error);
    }
    if(!user) {
        const error = new HttpError('Could not find user for provided id',404);
        return next(error);
    }
// commented out here
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        // console.log("ok here")
        user.places.push(createdPlace);
        await user.save({session : sess});
        await sess.commitTransaction();
    } catch(err) {
        console.log(err)
        const error = new HttpError('Creating place failed',500);
        return next(error);
    }
    res.status(201).json({place: createdPlace});
}

const updatePlace = async (req,res,next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const {title, description} = req.body;
    const placeId = req.params.pid;
    
    let place;
    try {
        place = await Place.findById(placeId);
    } catch(err) {
        const error = new HttpError('Something went wrong, could not update', 500);
        return next(error);
    }

    if(place.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this place', 401);
        return next(error);
    }

    place.title = title;
    place.description = description;
    
    try {
        await place.save();
    } catch(err) {
        const error = new HttpError('Something went wrong, could not update', 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({getters: true})});
}

const deletePlace = async (req,res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch(err) {
        const error = new HttpError('Something went wrong, could not delete', 500);
        return next(error);
    }

    
    if(!place){
        const error = new HttpError('Could not find a place', 404);
        return next(error);
    }
    if(place.creator.id !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this place', 401);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await Place.deleteOne({ _id: place._id }, { session: sess });
        place.creator.places.pull(place);
        await place.creator.save({session : sess});
        await sess.commitTransaction();
        
    } catch(err) {
        const error = new HttpError('Something went wrong, could not delete', 500);
        return next(error);
    }

    fs.unlink(place.image, (error) => console.log(error));

    res.status(200).json({message: 'Deleted'});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUser = getPlacesByUser;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;