import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductVariantInputDto {
  @ApiProperty({ description: 'Color name', example: 'Red' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ description: 'Quantity for this color', example: 10 })
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product title', example: 'Geladeira Frost Free 450L' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Product description', example: 'Geladeira Frost Free com controle digital' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Base price', example: 3500.9 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: 'Discounted price', example: 2999.9, required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  discountPrice?: number;

  @ApiProperty({ description: 'Additional specs as JSON', required: false, example: { voltage: '110V' } })
  @IsOptional()
  specs?: any;

  @ApiProperty({ description: 'Brand ID', required: false })
  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => (!value || value === '' || value === 'null' ? undefined : value))
  brandId?: string;

  @ApiProperty({
    description: 'Categories IDs associated to this product',
    type: [String],
    example: ['uuid-category-1', 'uuid-category-2'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === '') return undefined;
    if (typeof value === 'string') {
      if (value.startsWith('[')) {
        try { return JSON.parse(value); } catch (e) { return value; }
      }
      return [value];
    }
    return value;
  })
  categoryIds?: any;

  @ApiProperty({
    description: 'Variants for this product (color + quantity)',
    type: [ProductVariantInputDto],
    example: [
      { color: 'Red', quantity: 5 },
      { color: 'Blue', quantity: 3 },
    ],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === '') return undefined;
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch (e) { return undefined; }
    }
    return value;
  })
  variants?: any;

  @ApiProperty({
    description: 'Image URLs for this product',
    type: [String],
    required: false,
    example: ['uploads/products/img1.webp', 'uploads/products/img2.webp'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (!value || value === '' ? undefined : value))
  imageUrls?: string[];

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  files?: any;
}
