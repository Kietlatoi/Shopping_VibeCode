import {
  sequelize,
  Role,
  User,
  Shop,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Dispute,
  AuditLog
} from '../models/index.js';

const env = process.env.NODE_ENV || 'development';
const allowedSeedEnvironments = new Set(['development', 'test']);
const SAMPLE_PASSWORD = process.env.SAMPLE_SEED_PASSWORD || 'LocalSample123!';

if (!allowedSeedEnvironments.has(env)) {
  throw new Error(`Refusing to seed sample data when NODE_ENV=${env}`);
}

const roles = [
  { id: 1, name: 'Super Admin', permissions: { all: true } },
  { id: 2, name: 'Admin', permissions: { manage_products: true, manage_users: true } },
  { id: 3, name: 'Seller', permissions: { manage_own_products: true } },
  { id: 4, name: 'Buyer', permissions: { place_order: true } }
];

const users = [
  { email: 'admin@vibecode.com', password: SAMPLE_PASSWORD, role_id: 1, status: 'active' },
  { email: 'seller@vibecode.com', password: SAMPLE_PASSWORD, role_id: 3, status: 'active' },
  { email: 'seller2@vibecode.com', password: SAMPLE_PASSWORD, role_id: 3, status: 'active' },
  { email: 'buyer@vibecode.com', password: SAMPLE_PASSWORD, role_id: 4, status: 'active' },
  { email: 'buyer2@vibecode.com', password: SAMPLE_PASSWORD, role_id: 4, status: 'active' }
];

const productSamples = [
  {
    shopName: 'Vibe Fashion Store',
    ownerEmail: 'seller@vibecode.com',
    rating_vibe: 4.85,
    products: [
      {
        name: 'Áo thun basic unisex',
        description: 'Áo thun cotton mềm, form rộng dễ phối đồ hằng ngày.',
        category: 'Fashion',
        image: null,
        is_approved: true,
        variants: [
          { price: 159000, stock: 80, attributes: { color: 'Trắng', size: 'M' } },
          { price: 159000, stock: 65, attributes: { color: 'Đen', size: 'L' } }
        ]
      },
      {
        name: 'Túi tote canvas vibe',
        description: 'Túi tote canvas dày, phù hợp đi học, đi làm và mua sắm.',
        category: 'Accessories',
        image: null,
        is_approved: true,
        variants: [
          { price: 129000, stock: 120, attributes: { color: 'Be', material: 'Canvas' } }
        ]
      },
      {
        name: 'Áo khoác denim oversize',
        description: 'Áo khoác denim dáng rộng, chất vải đứng form.',
        category: 'Fashion',
        image: null,
        is_approved: true,
        variants: [
          { price: 459000, stock: 35, attributes: { color: 'Xanh denim', size: 'M' } },
          { price: 459000, stock: 28, attributes: { color: 'Xanh denim', size: 'L' } }
        ]
      }
    ]
  },
  {
    shopName: 'Tech Vibe Hub',
    ownerEmail: 'seller2@vibecode.com',
    rating_vibe: 4.72,
    products: [
      {
        name: 'Tai nghe bluetooth mini',
        description: 'Tai nghe không dây pin lâu, âm thanh rõ, hộp sạc nhỏ gọn.',
        category: 'Electronics',
        image: null,
        is_approved: true,
        variants: [
          { price: 349000, stock: 45, attributes: { color: 'Đen', warranty: '6 tháng' } },
          { price: 369000, stock: 30, attributes: { color: 'Trắng', warranty: '6 tháng' } }
        ]
      },
      {
        name: 'Bàn phím cơ compact 68 phím',
        description: 'Bàn phím cơ layout nhỏ gọn, switch êm, có đèn nền.',
        category: 'Electronics',
        image: null,
        is_approved: true,
        variants: [
          { price: 799000, stock: 22, attributes: { switch: 'Brown', layout: '68 keys' } },
          { price: 829000, stock: 18, attributes: { switch: 'Red', layout: '68 keys' } }
        ]
      },
      {
        name: 'Bình giữ nhiệt inox 500ml',
        description: 'Bình giữ nhiệt hai lớp, giữ nóng lạnh tốt trong ngày.',
        category: 'Home',
        image: null,
        is_approved: true,
        variants: [
          { price: 219000, stock: 55, attributes: { color: 'Xanh mint', capacity: '500ml' } },
          { price: 219000, stock: 42, attributes: { color: 'Đen', capacity: '500ml' } }
        ]
      },
      {
        name: 'Sản phẩm chờ duyệt mẫu',
        description: 'Sản phẩm mẫu để admin kiểm tra luồng duyệt sản phẩm.',
        category: 'Demo',
        image: null,
        is_approved: false,
        variants: [
          { price: 99000, stock: 10, attributes: { status: 'pending' } }
        ]
      }
    ]
  }
];

const findOrCreateUser = async (userData, transaction) => {
  const [user] = await User.findOrCreate({
    where: { email: userData.email },
    defaults: userData,
    transaction
  });

  return user;
};

const seedRoles = async (transaction) => {
  for (const role of roles) {
    await Role.findOrCreate({
      where: { id: role.id },
      defaults: role,
      transaction
    });
  }
};

const seedUsers = async (transaction) => {
  const seededUsers = {};

  for (const userData of users) {
    seededUsers[userData.email] = await findOrCreateUser(userData, transaction);
  }

  return seededUsers;
};

const seedShopsAndProducts = async (seededUsers, transaction) => {
  const variants = [];

  for (const shopSample of productSamples) {
    const [shop] = await Shop.findOrCreate({
      where: { owner_id: seededUsers[shopSample.ownerEmail].id },
      defaults: {
        owner_id: seededUsers[shopSample.ownerEmail].id,
        name: shopSample.shopName,
        rating_vibe: shopSample.rating_vibe
      },
      transaction
    });

    for (const productSample of shopSample.products) {
      const [product] = await Product.findOrCreate({
        where: {
          shop_id: shop.id,
          name: productSample.name
        },
        defaults: {
          shop_id: shop.id,
          name: productSample.name,
          description: productSample.description,
          category: productSample.category,
          image: productSample.image,
          is_approved: productSample.is_approved
        },
        transaction
      });

      for (const variantSample of productSample.variants) {
        const [variant] = await ProductVariant.findOrCreate({
          where: {
            product_id: product.id,
            price: variantSample.price,
            attributes: variantSample.attributes
          },
          defaults: {
            product_id: product.id,
            price: variantSample.price,
            stock: variantSample.stock,
            attributes: variantSample.attributes
          },
          transaction
        });

        variants.push(variant);
      }
    }
  }

  return variants;
};

const seedCart = async (buyer, variants, transaction) => {
  const [cart] = await Cart.findOrCreate({
    where: { user_id: buyer.id },
    defaults: { user_id: buyer.id },
    transaction
  });

  const cartSamples = [
    { variant: variants[0], quantity: 2 },
    { variant: variants[3], quantity: 1 }
  ];

  for (const cartSample of cartSamples) {
    await CartItem.findOrCreate({
      where: {
        cart_id: cart.id,
        variant_id: cartSample.variant.id
      },
      defaults: {
        cart_id: cart.id,
        variant_id: cartSample.variant.id,
        quantity: cartSample.quantity
      },
      transaction
    });
  }
};

const seedOrder = async (buyer, variants, transaction) => {
  const shipping_address = '123 Sample Street, District 1, Ho Chi Minh City';
  const orderItems = [
    { variant: variants[1], quantity: 1 },
    { variant: variants[5], quantity: 2 }
  ];
  const total_price = orderItems.reduce(
    (total, item) => total + Number(item.variant.price) * item.quantity,
    0
  );

  const [order] = await Order.findOrCreate({
    where: {
      user_id: buyer.id,
      shipping_address
    },
    defaults: {
      user_id: buyer.id,
      total_price,
      status: 'delivered',
      shipping_address,
      payment_method: 'COD'
    },
    transaction
  });

  for (const item of orderItems) {
    await OrderItem.findOrCreate({
      where: {
        order_id: order.id,
        variant_id: item.variant.id
      },
      defaults: {
        order_id: order.id,
        variant_id: item.variant.id,
        quantity: item.quantity,
        price_at_purchase: item.variant.price
      },
      transaction
    });
  }

  return order;
};

const seedAdminData = async (admin, order, transaction) => {
  await Dispute.findOrCreate({
    where: {
      order_id: order.id,
      reason: 'Khách báo sản phẩm giao trễ hơn dự kiến.'
    },
    defaults: {
      order_id: order.id,
      admin_id: admin.id,
      reason: 'Khách báo sản phẩm giao trễ hơn dự kiến.',
      status: 'investigating'
    },
    transaction
  });

  await AuditLog.findOrCreate({
    where: {
      user_id: admin.id,
      action: 'SEED_SAMPLE_DATA'
    },
    defaults: {
      user_id: admin.id,
      action: 'SEED_SAMPLE_DATA',
      metadata: { source: 'initialSeed' }
    },
    transaction
  });
};

const seed = async () => {
  try {
    await sequelize.sync({ force: false });

    await sequelize.transaction(async (transaction) => {
      await seedRoles(transaction);
      const seededUsers = await seedUsers(transaction);
      const variants = await seedShopsAndProducts(seededUsers, transaction);
      await seedCart(seededUsers['buyer@vibecode.com'], variants, transaction);
      const order = await seedOrder(seededUsers['buyer@vibecode.com'], variants, transaction);
      await seedAdminData(seededUsers['admin@vibecode.com'], order, transaction);
    });

    console.log('Sample data seeded successfully!');
    console.log('Sample accounts use SAMPLE_SEED_PASSWORD or the local default password.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
