import { User } from '../../modules/auth/entities/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';

export async function clean() {
  try {
    console.log('Cleaning database...');

    //Delete records in order to respect foreign key constraints
    await Product.destroy({ where: {}, force: true });
    console.log('Products deleted');

    await Category.destroy({ where: {}, force: true });
    console.log('Categories deleted');

    await User.destroy({ where: {}, force: true });
    console.log('Users deleted');

    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
}
