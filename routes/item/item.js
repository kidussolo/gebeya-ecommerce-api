const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const imageUpload = require('../../middlewares/imageUpload');
const Item = require('../../models/item');
const auth = require('../../middlewares/auth');

// @route POST /item
// @desc Add new item
// @access private
router.post(
    '/item',
    auth,
    imageUpload.upload.single('image'),
    [
        check('name', 'name can not be empty!').not().isEmpty(), 
        check('price', 'Price can not be empty!').not().isEmpty()
    ],
    async (req, res) => {
        try {
            errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
            
            const payload = {
                name: req.body.name,
                price: req.body.price,
                detail: req.body.detail,
                vendorName: req.body.vendorName,
                image: req.file.path
            }
            
            let item = await Item.create(payload);
            res.status(200).json({
                data: item
            });
        } catch(error){
            console.log(error);
            return res.status(500).json({ error: 'Internal Server error'});
        }
    }
);


module.exports = router;