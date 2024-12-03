import { Module } from '@nestjs/common';
import { DatabaseSeeder } from './database.seeder';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../modules/user/entities/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Category, Product])],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class DatabaseSeederModule {}
