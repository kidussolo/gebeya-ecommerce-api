const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const imageUpload = require('../../middlewares/imageUpload');
const Item = require('../../models/item');
const auth = require('../../middlewares/auth');
const { checkObjectId } = require('../../middlewares/checkObjectId');

/**
 * @swagger
 * /api/v1/item:
 *  post:
 *    description: Add new item
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            image:
 *              type: string
 *            price:
 *              type: string
 *            availableQuantity:
 *              type: integer
 *            detail:
 *              type: string
 *            vendorName:
 *              type: string
 *    security:
 *      - Auth: []
 *    responses:
 *      201:
 *        description: Return the created item detail
 *      400:
 *        description: Input validation error
 *      500:
 *        description: Internal server error
 */
router.post(
    '/item',
    auth,
    imageUpload.upload.single('image'),
    [
        check('name', 'name can not be empty!').not().isEmpty(), 
        check('price', 'Price can not be empty!').not().isEmpty(),
        check('availableQuantity', 'availableQuantity can not be empty!').not().isEmpty()
            .isInt({ min: 1}).withMessage('availableQuantity must be 1 or greater')
    ],
    async (req, res) => {
        try {
            errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
            
            const payload = {
                name: req.body.name,
                price: req.body.price,
                detail: req.body.detail,
                availableQuantity: req.body.availableQuantity,
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

/**
 * @swagger
 * /api/v1/item/{id}:
 *  get:
 *    description: Get item by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Item id
 *    security:
 *      - Auth: []
 *    responses:
 *      200:
 *        description: Return the item detail
 *      400:
 *        description: Input validation error
 *      500:
 *        description: Internal server error
 */
router.get('/item/:id', auth, checkObjectId('id'), async (req, res) => {
    try {
        const id = req.params.id;
        let item = await Item.findOne({ _id: id });
        if (!item) return res.status(404).json({ error: 'Item not found'});
        res.status(200).json({ data: item });
    } catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Internal Server error'});
    }
});

/**
 * @swagger
 * /api/v1/item/{id}:
 *  put:
 *    description: Update item
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Item id
 *    security:
 *      - Auth: []
 *    responses:
 *      200:
 *        description: Return the updated item
 *      400:
 *        description: Input validation error
 *      500:
 *        description: Internal server error
 */
router.put('/item/:id', auth, checkObjectId('id'), async (req, res) => {
    try {
        const id = req.params.id;
        const options = {
            new: true
        }
        let item = await Item.findByIdAndUpdate(id , req.body, options);

        res.status(200).json({data: item});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server error'});
    }
});

/**
 * @swagger
 * /api/v1/item/{id}:
 *  delete:
 *    description: Delete Item
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Item id
 *    security:
 *      - Auth: []
 *    responses:
 *      200:
 *        description: Return the deleted item
 *      400:
 *        description: Input validation error
 *      500:
 *        description: Internal server error
 */
router.delete('/item/:id', auth, checkObjectId('id'), async (req, res) => {
    try {
        const id = req.params.id;
        let item = await Item.findByIdAndRemove(id);
        if (!item) return res.status(404).json({ error: 'Item not found!'});
        res.status(200).json({data: item});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server error'});
    }
});

/**
 * @swagger
 * /api/v1/items:
 *  get:
 *    description: Get all items with pagination and also sorted with there price
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: Page number
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: The number of returned data
 *      - in: query
 *        name: price
 *        schema:
 *          type: string
 *        description: items sorting order based on price    
 *    security:
 *      - Auth: []
 *    responses:
 *      200:
 *        description: Return array of items
 *      400:
 *        description: Input validation error
 *      500:
 *        description: Internal server error
 */
router.get('/items', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortOrder = req.query.price || 'asc';
        const item = await Item.find({}).limit(limit).skip((page-1) * limit).sort({price: sortOrder});
        return res.status(200).json({ data: item });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server error'});
    }
})


module.exports = router;