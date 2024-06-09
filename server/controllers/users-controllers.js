const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getUsers = async (req ,res, next) => {
    let users;
    try {
        users = await User.find({}, '-password')
    } catch(err) {
        const error = new HttpError('fetching users failed', 500);
        return next(error);
    }

    res.json({users: users.map( user => user.toObject({getters: true}))});
}

const signup = async (req ,res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const {name, email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email});
    } catch(err) {
        const error = new HttpError('Signing up failed', 500);
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError('User exists already, login instead', 422);
        return next(error);
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (err) {
        return next(new HttpError("Couldn't create user! Please try again later.", 500));
      }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        places: []
    })

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError('Signing up failed',500);
        return next(error);
    }

    let token;

    try {
        token = jwt.sign({userId: createdUser.id,email: createdUser.email},
        process.env.JWT_KEY,{expiresIn: "1h"});
    } catch (err) {
        return next(new HttpError("Couldn't create user! Please try again later.", 500));
    }
    
    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
}

const login = async (req ,res, next) => {
    const {email, password} = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email});
    } catch(err) {
        const error = new HttpError('Logging in failed', 500);
        return next(error);
    }

    if(!existingUser) {
        const error =  new HttpError('Invalid credentials', 403);
        return next(error);
    }

    let passwordsMatch = false;

    try {
        passwordsMatch = await bcrypt.compare(password, existingUser.password);
        //console.log("password match");
    } catch (err) {
        return next(new HttpError("Couldn't log in! Please check your credentials.", 500));
    }
    
    if (!passwordsMatch) {
        return next(new HttpError("Invalid credentials could not log you in", 403));
    }

    let token;

    try {
        token = jwt.sign({userId: existingUser.id,email: existingUser.email},
        process.env.JWT_KEY,{expiresIn: "1h"});
    } catch (err) {
        return next(new HttpError("Logging in failed! Please try again later.", 500));
    }

    res.json({
        message: "Logged user in!",
        userId: existingUser.id,
        email: existingUser.email,
        token
    });
}

exports.signup = signup;
exports.getUsers = getUsers;
exports.login = login;