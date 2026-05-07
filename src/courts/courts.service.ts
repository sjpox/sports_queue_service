import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourtDto, UpdateCourtDto } from './dto';

@Injectable()
export class CourtsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.court.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const c = await this.prisma.court.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Court ${id} not found`);
    return c;
  }

  create(dto: CreateCourtDto) {
    return this.prisma.court.create({ data: dto });
  }

  async update(id: number, dto: UpdateCourtDto) {
    await this.findOne(id);
    return this.prisma.court.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.court.delete({ where: { id } });
  }
}
