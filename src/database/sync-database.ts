import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Product } from '../modules/products/entities/product.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { User } from "../modules/user/entities/user.entity";

dotenv.config();

const logger = new Logger('DatabaseSync');

async function syncDatabase() {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
  });

  sequelize.addModels([User, Product, Category]);

  try {
    logger.log('Sincronizando base de datos...');
    await sequelize.sync({ alter: true }); // En desarrollo
    // await sequelize.sync({ force: false }); // En producción
    logger.log('Base de datos sincronizada exitosamente');
  } catch (error) {
    console.error('Error sincronizando la base de datos:', error);
    logger.error('Error sincronizando la base de datos:', error);
    throw error;
  } finally {

    await sequelize.close();
  }
}

export { syncDatabase };
