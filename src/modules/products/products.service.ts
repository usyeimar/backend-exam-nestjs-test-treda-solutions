import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';
import { FilterProductsDto } from './dto/filter-product.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.categoryId) {
      const category = await this.categoryModel.findByPk(
        createProductDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createProductDto.categoryId} not found`,
        );
      }
    }

    return this.productModel.create({ ...createProductDto });
  }

  async findAll(filters: FilterProductsDto) {
    const whereClause: any = {};

    // Search by name
    if (filters.search) {
      whereClause.name = {
        [Op.iLike]: `%${filters.search}%`,
      };
    }

    // Filter by category ID
    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }

    //Filter by price
    if (filters.minPrice && filters.maxPrice) {
      whereClause.price = {
        [Op.between]: [filters.minPrice, filters.maxPrice],
      };
    } else if (filters.minPrice) {
      whereClause.price = {
        [Op.gte]: filters.minPrice,
      };
    } else if (filters.maxPrice) {
      whereClause.price = {
        [Op.lte]: filters.maxPrice,
      };
    }

    //Filter by stock
    if (filters.minStock) {
      whereClause.stock = {
        [Op.gte]: filters.minStock,
      };
    }

    //Order by field
    const order: any = [[filters.sortBy || 'name', filters.order || 'ASC']];

    //Pagination
    const limit = filters.limit || 10;
    const offset = ((filters.page || 1) - 1) * limit;
    try {
      const { rows: products, count } = await this.productModel.findAndCountAll(
        {
          where: whereClause,
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
            },
          ],
          limit,
          offset,
          order,
        },
      );

      return {
        items: products,
        meta: {
          totalItems: count,
          itemCount: products.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(count / limit),
          currentPage: filters.page || 1,
        },
      };
    } catch (error) {
      throw new Error(`Error retrieving products: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({
      where: { id },
      include: [Category],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    await product.update(updateProductDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }
}
