const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");


const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Could not find any user", 500)
    return next(error)
  }

  res.status(200).json({ users: users.map(user => user.toObject({ getters: true})) })
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next( new HttpError("User data are invalid", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });

  } catch (err) {
    const error = new HttpError("Signing up failed", 500);
    return next(error)
  }

  if (existingUser){
      const error = new HttpError("This user already exists", 422);
      return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again.', 500);
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: []
  })

  try {
    await newUser.save();
  } catch (e) {
    const error = new HttpError("Signing Up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      'fish_glove_cube',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed", 500);
    return next(error)
  }

  res.status(201).json({
    userId: newUser.id,
    name: newUser.name,
    email: newUser.email,
    token: token
  });
}

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError("Logging in failed", 500);
    return next(error)
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please check your credentials and try again.");
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        name: existingUser.name,
        email: existingUser.email
      },
      'fish_glove_cube',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed", 500);
    return next(error)
  }

  res.json({
    userId: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    token: token
  })
}

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
