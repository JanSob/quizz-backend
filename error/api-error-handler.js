const ApiError = require('./ApiError');

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }

  // 'Fallback'-status for any other case that has not been handled, in order to avoid
  // leaking internal backend-information to the frontend
  res.status(500).json('Something went wrong, please try again later');
}

module.exports = apiErrorHandler;