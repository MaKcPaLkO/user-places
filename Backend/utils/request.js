const HttpError = require("../models/http-error");

const request = async (cb, errorMessage, errorCode, next) => {
  try {

    return await cb();
  } catch (err) {
    const error = new HttpError(errorMessage, errorCode);
    return next(error);
  }
}

module.exports = request;
