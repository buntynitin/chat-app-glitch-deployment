const jwt = require('jsonwebtoken')

module.exports = function (req, res, next){
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({error : 'Access Denied'});
    try{
        const user = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = user;
        next();
    }catch(e){
        res.status(401).json({error : 'Invalid credentials'});
    }
}