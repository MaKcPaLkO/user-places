const fs = require("fs");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");

const getAllPlaces = async (req, res, next) => {
  let places;

  try {
    places = await Place.find();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }


  res.status(200).json({places: places.map( place => place.toObject({ getters: true }))})
}

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find a place.", 500);
    return next(error)
  }

  if (!place) {
    const error = new HttpError("The place doesn't exist here", 404);
    return next(error);
  }

  res.json({ place: place.toObject( {getters: true} ) })
}

const getPlacesByUserId = async (req, res, next) => {
  const userID = req.params.uid;
  let places;

  try {
    places = await Place.find({creator: userID});
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (places.length === 0) {
    return next(new HttpError("This user doesn't has own places", 404));
  }

  res.json({places: places.map(place => place.toObject({ getters: true }))})
}

const createNewPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    image: req.file.path,
    creator
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again.", 500);
    return next(error);
  }


  res.status(201).json({place: createdPlace});
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next( new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err)
    const error = new HttpError("Something went wrong", 500)
    return next(error)
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("Access denied", 401);
    return next(error)
  }

  let prevImage = place.image;

  place.title = title;
  place.description = description;
  if (place.image && req.file) {
    place.image = req.file.path;
  }


  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  fs.unlink(prevImage, err => console.log(err));

  res.status(200).json({place: place.toObject({ getters: true })})
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (err) {
    const error = new HttpError("Could not find selected place", 404);
    return next(error)
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError("Access denied", 403);
    return next(error)
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({session: sess});
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Could not delete place", 500);
    return next(error);
  }

  fs.unlink(imagePath, err => {});

  res.status(200).json({message: "The place was deleted"});
}


exports.getAllPlaces = getAllPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createNewPlace = createNewPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
