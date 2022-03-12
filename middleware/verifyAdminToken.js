const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const { badCredentials } = require('../error/ApiError');


// For the admin-check JWT is used with HS256 and a particulary strong secret key (512 bit)
module.exports = function(req, res, next){
    const token = req.header('auth-token');
    if(!token) return next(ApiError.badCredentials('Authorization failed, access denied'));

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded._id;
        next();
    } catch (error) {
        return next(ApiError.badCredentials('Authorization failed, access denied'));
    }
}