import { Sport } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEnum(Sport)
  sport?: Sport;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  skillLevel?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Sport)
  sport?: Sport;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  skillLevel?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
