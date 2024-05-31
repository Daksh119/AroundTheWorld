const jwt = require("jsonwebtoken");
require("dotenv").config();

const error = require("../models/http-error");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // console.log(req.headers.authorization)
    const token = req.headers.authorization; // Authorization: "Bearer TOKEN"

    if (!token) {
      throw new Error('Authentication failed!');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {userId : decodedToken.userId};

    next();
  } catch (err) {
    return next(new HttpError("Authentication failed!", 403));
  }
}