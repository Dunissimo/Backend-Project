import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { IDValidationPipe } from 'src/pipes/id-validation.pipe';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JWTAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async get(@Param('id', IDValidationPipe) id: string) {
    const product = await this.productService.findById(id);

    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    return product;
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', IDValidationPipe) id: string,
    @Body() dto: ProductModel,
  ) {
    const updatedProduct = await this.productService.updateById(id, dto);
    console.log(updatedProduct);

    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    return updatedProduct;
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IDValidationPipe) id: string) {
    const deletedProduct = await this.productService.deleteById(id);

    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
