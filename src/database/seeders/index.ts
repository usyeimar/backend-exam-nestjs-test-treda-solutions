import { User } from '../../modules/auth/entities/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

export async function seed() {
  const logger = new Logger('DatabaseSeeder');
  logger.log('Seeding database...');

  try {
    //Create admin user if it doesn't exist
    const existingAdmin = await User.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      logger.log('Admin user created');
    } else {
      logger.log('Admin user already exists');
    }

    // Create categories if they don't exist
    const categoryNames = ['Electronics', 'Clothing', 'Books'];
    const categories = [];

    for (const name of categoryNames) {
      const [category] = await Category.findOrCreate({
        where: { name },
        defaults: {
          description: `${name} category description`,
        },
      });
      categories.push(category);
      logger.log(`Category ${name} processed`);
    }

    // Create products if they don't exist
    const productsData = [
      {
        name: 'Laptop',
        description: 'High performance laptop',
        price: 999.99,
        stock: 10,
        categoryId: categories[0].id,
      },
      {
        name: 'Smartphone',
        description: 'Latest model smartphone',
        price: 699.99,
        stock: 15,
        categoryId: categories[0].id,
      },
      {
        name: 'T-Shirt',
        description: 'Cotton t-shirt',
        price: 19.99,
        stock: 100,
        categoryId: categories[1].id,
      },
      {
        name: 'Programming Book',
        description: 'Learn programming basics',
        price: 49.99,
        stock: 30,
        categoryId: categories[2].id,
      },
    ];

    for (const productData of productsData) {
      const [product] = await Product.findOrCreate({
        where: { name: productData.name },
        defaults: productData,
      });
      logger.log(`Product ${product.name} processed`);
    }

    logger.log('Seed completed successfully');
  } catch (error) {
    logger.error('Error seeding database:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      logger.error('Duplicate entry found:', error.errors);
    }
  }
}
