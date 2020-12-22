const mongoose = require('mongoose');

const checkObjectId = (idToCheck) => (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params[idToCheck])) {
        return res.status(400).json({ error: 'Invalid ID!'});
    }
    next();
}

const checkBodyObjectId = (idToCheck) => (req, res, next) => {
    for (item of req.body) {
        if(!mongoose.Types.ObjectId.isValid(item[idToCheck])) {
            return res.status(400).json({ error: `Invalid ID ${item[idToCheck]}`});
        }
    }
    next();
}

module.exports = {
    checkObjectId,
    checkBodyObjectId
};