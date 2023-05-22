import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './reviews.constants';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedDoc = await this.reviewService.delete(id);

    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Get('byProduct/:productId')
  async getByProductId(@Param('productId') productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  // @Post('')
  async deleteByProductId(@Param('productId') productId: string) {}
}
