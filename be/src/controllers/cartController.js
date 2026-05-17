import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import ProductVariant from '../models/ProductVariant.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: ProductVariant,
          as: 'variant',
          include: [{
            model: Product,
            as: 'product',
            include: [{ model: Shop, as: 'shop', attributes: ['id', 'name', 'rating_vibe'] }]
          }]
        }]
      }]
    });

    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
      return res.status(200).json({
        success: true,
        data: { ...cart.toJSON(), items: [] }
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { variant_id, quantity } = req.body;

    let cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
    }

    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, variant_id }
    });

    if (cartItem) {
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cart_id: cart.id,
        variant_id,
        quantity: parseInt(quantity)
      });
    }

    res.status(200).json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({
      where: { id },
      include: [{ model: Cart, as: 'cart', where: { user_id: req.user.id } }]
    });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (parseInt(quantity) <= 0) {
      await cartItem.destroy();
      return res.status(200).json({ success: true, message: 'Item removed' });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    res.status(200).json({ success: true, data: cartItem });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartItem = await CartItem.findOne({
      where: { id },
      include: [{ model: Cart, as: 'cart', where: { user_id: req.user.id } }]
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    await cartItem.destroy();

    res.status(200).json({ success: true, message: 'Item removed' });
  } catch (error) {
    next(error);
  }
};
