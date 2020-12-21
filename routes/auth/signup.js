const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check ,validationResult } = require('express-validator');
const User = require('../../models/user');

// @route POST /signup
// @desc Signup a User
// @access public
router.post('/signup', 
    [
        check('email', 'Email can not be empty!').not().isEmpty(), 
        check('password', 'Password can not be empty!').not().isEmpty()
    ],
    async (req, res) => {
        try {
            errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

            const { email, password } = req.body;
            let user = await User.findOne({ email });

            if(user) return res.status(400).json({ error: 'User with this email already exists'});
            user = new User({
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            return res.status(200).json({ message: 'User signup successfull'});
        } catch(error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server error'});
        }
})

module.exports = router;