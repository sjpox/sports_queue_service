import { CourtStatus, Sport } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEnum(Sport)
  sport?: Sport;

  @IsOptional()
  @IsEnum(CourtStatus)
  status?: CourtStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}

export class UpdateCourtDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Sport)
  sport?: Sport;

  @IsOptional()
  @IsEnum(CourtStatus)
  status?: CourtStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}
