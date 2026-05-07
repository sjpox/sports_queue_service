import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto';

const round2 = (n: number) => Math.round(n * 100) / 100;
const toNum = (d: Prisma.Decimal | number | string) => Number(d);

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.session.findMany({
      orderBy: [{ sessionDate: 'desc' }, { id: 'desc' }],
    });
  }

  async findOne(id: number) {
    const s = await this.prisma.session.findUnique({
      where: { id },
      include: {
        courts: { include: { court: true } },
        players: {
          include: { player: true },
          orderBy: { player: { name: 'asc' } },
        },
      },
    });
    if (!s) throw new NotFoundException(`Session ${id} not found`);
    return {
      ...s,
      courts: s.courts.map((sc) => sc.court),
      players: s.players.map((sp) => ({
        ...sp.player,
        gamesPlayed: sp.gamesPlayed,
      })),
    };
  }

  create(dto: CreateSessionDto) {
    const {
      sessionDate,
      sport,
      hours = 2,
      shuttleCost = 0,
      miscCost = 0,
      courtIds = [],
      playerIds = [],
    } = dto;

    return this.prisma.session.create({
      data: {
        sessionDate: new Date(sessionDate),
        sport,
        hours,
        shuttleCost,
        miscCost,
        courts: { create: courtIds.map((courtId) => ({ courtId })) },
        players: { create: playerIds.map((playerId) => ({ playerId })) },
      },
    });
  }

  async expenseForecast(id: number) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { courts: { include: { court: true } } },
    });
    if (!session) throw new NotFoundException(`Session ${id} not found`);

    const playerCount = await this.prisma.sessionPlayer.count({
      where: { sessionId: id },
    });

    const sumRate = session.courts.reduce(
      (acc, sc) => acc + toNum(sc.court.hourlyRate),
      0,
    );
    const hours = toNum(session.hours);
    const courtCost = sumRate * hours;
    const total = courtCost + toNum(session.shuttleCost) + toNum(session.miscCost);
    const perPlayer = playerCount > 0 ? total / playerCount : 0;

    return {
      sessionId: session.id,
      hours,
      courtCost: round2(courtCost),
      shuttleCost: toNum(session.shuttleCost),
      miscCost: toNum(session.miscCost),
      total: round2(total),
      playerCount,
      perPlayer: round2(perPlayer),
    };
  }
}
