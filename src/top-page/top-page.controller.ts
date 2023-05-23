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
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { IDValidationPipe } from 'src/pipes/id-validation.pipe';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JWTAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async get(@Param('id', IDValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);

    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return page;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias);

    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return page;
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', IDValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedPage = await this.topPageService.updateById(id, dto);

    if (!updatedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return updatedPage;
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IDValidationPipe) id: string) {
    const deletedPage = await this.topPageService.deleteById(id);

    if (!deletedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }

  @Get('byText/:text')
  async findByText(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  }
}
