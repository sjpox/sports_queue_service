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
import { CourtsService } from './courts.service';
import { CreateCourtDto, UpdateCourtDto } from './dto';

@Controller('api/courts')
export class CourtsController {
  constructor(private readonly courts: CourtsService) {}

  @Get()
  findAll() {
    return this.courts.findAll();
  }

  @Post()
  create(@Body() dto: CreateCourtDto) {
    return this.courts.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourtDto) {
    return this.courts.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courts.remove(id);
  }
}
