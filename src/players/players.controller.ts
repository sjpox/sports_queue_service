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
import { PlayersService } from './players.service';
import { CreatePlayerDto, UpdatePlayerDto } from './dto';

@Controller('api/players')
export class PlayersController {
  constructor(private readonly players: PlayersService) {}

  @Get()
  findAll() {
    return this.players.findAll();
  }

  @Post()
  create(@Body() dto: CreatePlayerDto) {
    return this.players.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlayerDto) {
    return this.players.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.players.remove(id);
  }
}
