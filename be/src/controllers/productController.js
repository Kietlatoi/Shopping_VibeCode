import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Shop from '../models/Shop.js';
import { Op } from 'sequelize';

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = 'newest',
      category = ''
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {
      is_approved: true
    };

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (category) {
      where.category = category;
    }

    // Default sorting
    let order = [['created_at', 'DESC']];

    // Sort by price (joining variants)
    // Note: This is simplified. Real-world would use min price.
    if (sort === 'price-asc') order = [[{ model: ProductVariant, as: 'variants' }, 'price', 'ASC']];
    if (sort === 'price-desc') order = [[{ model: ProductVariant, as: 'variants' }, 'price', 'DESC']];

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      include: [
        { model: ProductVariant, as: 'variants' },
        { model: Shop, as: 'shop', attributes: ['name', 'rating_vibe'] }
      ],
      distinct: true
    });

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: ProductVariant, as: 'variants' },
        { model: Shop, as: 'shop' }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};
