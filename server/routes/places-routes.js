const express = require('express');

const {check} = require('express-validator');
const fileUpload = require('../middleware/file-upload');
const isAuth = require("../middleware/auth");

const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

// public routes
router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUser);

router.use(isAuth); //auth middleware

//protected routes 
router.post('/', [check('title').not().isEmpty(),
check('description').isLength({min: 5}),
check('address').not().isEmpty()], placesControllers.createPlace);

router.patch('/:pid',[check('title').not().isEmpty(),
check('description').isLength({min: 5})],placesControllers.updatePlace);

router.delete('/:pid',placesControllers.deletePlace);

module.exports = router;