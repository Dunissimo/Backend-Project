import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model';
import { Type } from 'class-transformer';

export class HhDataDto {
  @IsNumber()
  count: number;

  @IsNumber()
  juinorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

export class TopPageAdvantageDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export interface CreateTopPageDto extends Base {}
export class CreateTopPageDto extends TimeStamps {
  @IsEnum(TopLevelCategory)
  firstLevelCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  // should be unique
  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @Type(() => HhDataDto)
  @ValidateNested()
  hh?: HhDataDto;

  @IsArray()
  @Type(() => TopPageAdvantageDto)
  @ValidateNested()
  advantages: TopPageAdvantageDto[];

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
