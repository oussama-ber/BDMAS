const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // (header)Authorization: 'Bearer TOKEN'
    if (!token) {
      console.log(token)
      throw new Error('Authentication failed!');
    }
    // console.log('token from back check auth' + token)
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.userData = { userId: decodedToken.userId, role: decodedToken.role};
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed! after userData', 401);
    return next(error);
  }
};
