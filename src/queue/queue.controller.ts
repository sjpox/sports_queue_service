import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { GenerateQueueDto, UpdateMatchDto } from './dto';

@Controller('api/queue')
export class QueueController {
  constructor(private readonly queue: QueueService) {}

  @Get('session/:id')
  list(@Param('id', ParseIntPipe) id: number) {
    return this.queue.listForSession(id);
  }

  @Post('session/:id/generate')
  generate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GenerateQueueDto,
  ) {
    return this.queue.generate(id, dto);
  }

  @Put('match/:id')
  updateMatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatchDto,
  ) {
    return this.queue.updateMatch(id, dto);
  }

  @Delete('session/:id')
  @HttpCode(204)
  reset(@Param('id', ParseIntPipe) id: number) {
    return this.queue.resetSession(id);
  }
}
