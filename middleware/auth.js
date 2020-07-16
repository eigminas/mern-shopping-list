const config = require('config'); // get default.json where we have mongoURI and jwtSecret
// jwtSecret holds our secret key
const jwt = require('jsonwebtoken'); // get jsonwebtoken

function auth(req, res, next) {
    // User will need to supply username/passowrd for the first time and the
    // server will return access-token and place it in 'x-auth-token' field
    const token = req.header('x-auth-token');

    // check for token
    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }

    try{
         // verify token
         const decoded = jwt.verify(token, config.get('jwtSecret'));

        // add user from payload
        req.user = decoded;
        next();
    } catch(e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
   
}

module.exports = auth;