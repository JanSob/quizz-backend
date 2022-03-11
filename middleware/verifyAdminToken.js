const jwt = require('jsonwebtoken');

// For the admin-check JWT is used with HS256 and a particulary strong secret key (512 bit)
module.exports = function(req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Authorization failed, access denied');

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded._id;
        next();
    } catch (error) {
        res.status(400).send('Authorization failed, access denied');
    }
}