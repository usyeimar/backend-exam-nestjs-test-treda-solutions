import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { User } from '../../modules/user/entities/user.entity';

export async function seed() {
  const logger = new Logger('DatabaseSeeder');
  logger.log('Starting database seed...');

  try {
    // Create admin user
    const [adminUser] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        nickName: 'admin',
        firstName: 'Admin',
        lastName: 'System',
        role: 'admin',
        bio: 'System administrator',
      },
    });
    logger.log(adminUser ? 'Admin user already exists' : 'Admin user created');

    // Create test user
    const [testUser] = await User.findOrCreate({
      where: { email: 'test@example.com' },
      defaults: {
        email: 'test@example.com',
        password: await bcrypt.hash('test123', 10),
        nickName: 'user',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        bio: 'Test user account',
      },
    });
    logger.log(testUser ? 'Test user already exists' : 'Test user created');

    // Create categories
    const categoryData = [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
      },
      {
        name: 'Clothing',
        description: 'Apparel and fashion items',
      },
      {
        name: 'Books',
        description: 'Books and educational materials',
      },
    ];

    const categories = await Promise.all(
      categoryData.map(async (cat) => {
        const [category] = await Category.findOrCreate({
          where: { name: cat.name },
          defaults: cat,
        });
        logger.log(`Category ${cat.name} processed`);
        return category;
      }),
    );

    // Create products
    const productsData = [
      {
        name: 'Laptop',
        description: 'High performance laptop with latest specifications',
        price: 999.99,
        stock: 10,
        categoryId: categories[0].id,
      },
      {
        name: 'Smartphone',
        description: 'Latest model smartphone with advanced features',
        price: 699.99,
        stock: 15,
        categoryId: categories[0].id,
      },
      {
        name: 'T-Shirt',
        description: 'Premium cotton t-shirt, comfortable and stylish',
        price: 19.99,
        stock: 100,
        categoryId: categories[1].id,
      },
      {
        name: 'Programming Book',
        description: 'Comprehensive guide to modern programming',
        price: 49.99,
        stock: 30,
        categoryId: categories[2].id,
      },
    ];

    for (const productData of productsData) {
      const [product, created] = await Product.findOrCreate({
        where: { name: productData.name },
        defaults: productData,
      });
      logger.log(
        `Product ${product.name} ${created ? 'created' : 'already exists'}`,
      );
    }

    logger.log('Seed completed successfully');
  } catch (error) {
    logger.error('Error during database seed:', {
      error: error.message,
      stack: error.stack,
    });

    if (error.name === 'SequelizeUniqueConstraintError') {
      logger.error('Duplicate entry error:', {
        field: error.errors[0]?.path,
        value: error.errors[0]?.value,
      });
    }

    throw error;
  }
}
