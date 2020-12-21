const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (error, decoded) => {
                if (error) {
                    return res.status(401).json({ msg: 'Invalid token' });
                } else {
                    req.user = decoded.user;
                    next();
                }
            }
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server error'});
    }
}