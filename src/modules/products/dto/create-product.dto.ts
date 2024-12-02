import { IsNotEmpty, IsString, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Laptop' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'A laptop is a beautiful device for any task you need to do',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 1000,
  })
  @IsNotEmpty({
    message: 'Price is required',
  })
  @IsNumber({
    allowNaN: false,
  })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Product stock',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Category ID',
    example: 'b4d7b6e4-0f1b-4b3d-9a3d-0a1a0f0b9f7c',
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
