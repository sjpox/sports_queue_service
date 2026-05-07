import { SessionSport } from '@prisma/client';
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  sessionDate!: string;

  @IsEnum(SessionSport)
  sport!: SessionSport;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  shuttleCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  miscCost?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  courtIds?: number[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  playerIds?: number[];
}
