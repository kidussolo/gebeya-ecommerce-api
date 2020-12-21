const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email'],
    },
    password: {
        type: String,
        required: [true, 'Please enter password']
    }
},{
    timestamps: true
})

const User = mongoose.model('User', UserSchema);
module.exports = User;