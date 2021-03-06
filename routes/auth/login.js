const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/user');

/**
 * @swagger
 * /api/v1/login:
 *  post:
 *    description: login users
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: Return user authentication token
 *      400:
 *        description: Input validation error
 *      500:
 *        description: Internal server error
 */
router.post('/login', 
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

            if(!user) return res.status(400).json({ error: 'Incorrect Email or Password.'});
            const validatePassword = await bcrypt.compare(password, user.password);
            
            if (!validatePassword) return res.status(400).json({ error: 'Incorrect Email or Password.'});

            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1 days' },
                (error, token) => {
                    if (error) throw error;
                    return res.status(200).json({
                        token: token
                    });
                }
            );
        } catch(error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server error'});
        }  
});

module.exports = router;