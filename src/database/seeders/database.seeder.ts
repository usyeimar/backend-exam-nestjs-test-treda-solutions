import { Injectable, Logger } from '@nestjs/common';
import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';
import { User } from '../../modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { usersData } from './data/users.data';
import { categoriesData } from './data/categories.data';
import { createProductsData } from './data/products.data';

@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  async seed() {
    this.logger.log('Starting database seed...');

    try {
      // Seed users
      await this.seedUsers();

      // Seed categories
      const categories = await this.seedCategories();

      // Seed products
      await this.seedProducts(categories);

      this.logger.log('Seed completed successfully');
    } catch (error) {
      this.handleError(error);
    }
  }

  private async seedUsers() {
    for (const userData of usersData) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          ...userData,
          password: await bcrypt.hash(userData.password, 10),
        },
      });

      this.logger.log(
        `User ${userData.email} ${created ? 'created' : 'already exists'}`,
      );
    }
  }

  private async seedCategories() {
    const categories = await Promise.all(
      categoriesData.map(async (categoryData) => {
        const [category, created] = await Category.findOrCreate({
          where: { name: categoryData.name },
          defaults: categoryData,
        });

        this.logger.log(
          `Category ${categoryData.name} ${created ? 'created' : 'already exists'}`,
        );

        return category;
      }),
    );

    return categories;
  }

  private async seedProducts(categories: Category[]) {
    const productsData = createProductsData(categories);

    for (const productData of productsData) {
      const [product, created] = await Product.findOrCreate({
        where: { name: productData.name },
        defaults: productData,
      });

      this.logger.log(
        `Product ${productData.name} ${created ? 'created' : 'already exists'}`,
      );
    }
  }

  private handleError(error: any) {
    this.logger.error('Error during database seed:', {
      error: error.message,
      stack: error.stack,
    });

    if (error.name === 'SequelizeUniqueConstraintError') {
      this.logger.error('Duplicate entry error:', {
        field: error.errors[0]?.path,
        value: error.errors[0]?.value,
      });
    }

    throw error;
  }
}
