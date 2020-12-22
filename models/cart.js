const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    itemTotal: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [CartItemSchema],
    total: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
