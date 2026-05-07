import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto, UpdatePlayerDto } from './dto';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.player.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const p = await this.prisma.player.findUnique({ where: { id } });
    if (!p) throw new NotFoundException(`Player ${id} not found`);
    return p;
  }

  create(dto: CreatePlayerDto) {
    return this.prisma.player.create({ data: dto });
  }

  async update(id: number, dto: UpdatePlayerDto) {
    await this.findOne(id);
    return this.prisma.player.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.player.delete({ where: { id } });
  }
}
