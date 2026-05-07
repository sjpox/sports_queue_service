import { MatchStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class GenerateQueueDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  rounds?: number;
}

export class UpdateMatchDto {
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsInt()
  courtId?: number;
}
