import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Shop from '../models/Shop.js';

export const getProductsByShop = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const products = await Product.findAll({
      where: { shop_id: shopId, is_approved: true },
      include: [
        { model: ProductVariant, as: 'variants' },
        { model: Shop, as: 'shop', attributes: ['id', 'name', 'rating_vibe'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
