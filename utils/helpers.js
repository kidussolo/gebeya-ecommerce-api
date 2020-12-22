const Item = require('../models/item');

const prepareItem = async (cartItems) => {
  try {
    let items = [];
    let total = 0;
    for (cartItem of cartItems) {
      item = await Item.findOne({_id: cartItem.itemId});
      let itemTotal = item.price * cartItem.quantity;
      const payload = {
        itemId: item.id,
        quantity: cartItem.quantity,
        price: item.price,
        itemTotal: total,
      };
      items.push(payload);
      total = total + itemTotal;
    }
    return {
      items,
      total,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updateCartItem = async (newCartItems, cart) => {
  try {
    let total = cart.total;
    for (newCartItem of newCartItems) {
      let item = await Item.findOne({_id: newCartItem.itemId});

      let itemIndex = await cart.items.findIndex(
        (item) => item.itemId == newCartItem.itemId
      );

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity =
          cart.items[itemIndex].quantity + newCartItem.quantity;
        cart.items[itemIndex].price = item.price;
        cart.items[itemIndex].itemTotal =
          cart.items[itemIndex].itemTotal +
          cart.items[itemIndex].price * newCartItem.quantity;
        total = total + cart.items[itemIndex].price * newCartItem.quantity;
      } else {
        itemTotal = item.price * newCartItem.quantity;
        const payload = {
          itemId: item.id,
          quantity: newCartItem.quantity,
          price: item.price,
          itemTotal: itemTotal,
        };
        cart.items.push(payload);
        total = total + itemTotal;
      }
    }

    return {
      items: cart.items,
      total: parseInt(total),
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  prepareItem,
  updateCartItem,
};
