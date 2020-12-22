const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const Item = require('../../models/item');
const Cart = require('../../models/cart');
const auth = require('../../middlewares/auth');
const {checkBodyObjectId, checkObjectId} = require('../../middlewares/checkObjectId');
const {prepareItem, updateCartItem} = require('../../utils/helpers');

/**
 * @swagger
 * /api/v1/cart:
 *  post:
 *    description: Add item to cart
 *    parameters:
 *      - in: body
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              itemId:
 *                type: string
 *              quantity:
 *                type: integer
 *    security:
 *      - Auth: []
 *    responses:
 *      200:
 *        description: Return the cart with the new item in it
 *      400:
 *        description: Input validation error
 *      500:
 *        description: Internal server error
 */
router.post(
  '/cart',
  auth,
  [
    body().isArray().withMessage('body must be array of items'),
    body('*.itemId', 'Item Id can not be empty!').not().isEmpty(),
    body('*.quantity', 'Quantity can not be empty!')
      .not()
      .isEmpty()
      .isInt({min: 1})
      .withMessage('quantity must be 1 or greater'),
  ],
  checkBodyObjectId('itemId'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({error: errors.array()});

      const cartItems = req.body;
      for (cartItem of cartItems) {
        item = await Item.findOne({_id: cartItem.itemId});
        if (!item)
          return res
            .status(404)
            .json({error: `Item with id ${cartItem.itemId} not found`});
        if (cartItem.quantity > item.availableQuantity) {
          return res
            .status(400)
            .json({error: `${item.name} Required quantity not available`});
        }
      }

      let cart = await Cart.findOne({user: req.user.id});
      if (!cart) {
        const {items, total} = await prepareItem(cartItems);
        const payload = {
          user: req.user.id,
          items: items,
          total: total,
        };
        const cart = await Cart.create(payload);
        res.status(201).json({data: cart});
      } else {
        const {items, total} = await updateCartItem(cartItems, cart);
        cart.items = items;
        cart.total = total;
        await cart.save();
        res.status(201).json({data: cart});
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: 'Internal Server error'});
    }
  }
);

/**
 * @swagger
 * /api/v1/cart-item/{id}:
 *  delete:
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
 *        description: Return cart after item removed
 *      400:
 *        description: Input validation error
 *      500:
 *        description: Internal server error
 */
router.delete('/cart-item/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const cart = await Cart.findOne({user: req.user.id});
    if (!cart) return res.status(404).json({error: 'Cart not found'});
    const id = req.params.id;

    let itemIndex = cart.items.findIndex((item) => item.itemId == id);

    if (itemIndex == -1) return res.status(404).json({error: 'Item not found'});
    cart.total = cart.total - cart.items[itemIndex].itemTotal;
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json({data: cart});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Internal Server error'});
  }
});

module.exports = router;
