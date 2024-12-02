import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Product } from '../../products/entities/product.entity';

@Table({ tableName: 'categories' })
export class Category extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @HasMany(() => Product)
  products: Product[];
}
