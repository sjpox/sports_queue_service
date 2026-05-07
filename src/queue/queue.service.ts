import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QueueMatch } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateQueueDto, UpdateMatchDto } from './dto';

type Hydrated = Omit<QueueMatch, 'teamA' | 'teamB'> & {
  teamA: number[];
  teamB: number[];
  courtName?: string | null;
};

const hydrate = (m: QueueMatch & { court?: { name: string } | null }): Hydrated => ({
  ...m,
  teamA: m.teamA ? m.teamA.split(',').map(Number) : [],
  teamB: m.teamB ? m.teamB.split(',').map(Number) : [],
  courtName: m.court?.name ?? null,
});

interface PairingPlayer {
  id: number;
  gamesPlayed: number;
}

function buildRoundRobinRound(
  players: PairingPlayer[],
  maxCourts: number,
): { teamA: number[]; teamB: number[] }[] {
  const sorted = [...players].sort((a, b) => {
    if (a.gamesPlayed !== b.gamesPlayed) return a.gamesPlayed - b.gamesPlayed;
    return Math.random() - 0.5;
  });
  const courts = Math.max(1, maxCourts || 1);
  const playable = Math.min(sorted.length - (sorted.length % 4), courts * 4);
  const matches: { teamA: number[]; teamB: number[] }[] = [];
  for (let i = 0; i < playable; i += 4) {
    const four = sorted.slice(i, i + 4);
    matches.push({
      teamA: [four[0].id, four[3].id],
      teamB: [four[1].id, four[2].id],
    });
  }
  return matches;
}

@Injectable()
export class QueueService {
  constructor(private readonly prisma: PrismaService) {}

  async listForSession(sessionId: number) {
    const matches = await this.prisma.queueMatch.findMany({
      where: { sessionId },
      include: { court: true },
      orderBy: [{ roundNo: 'asc' }, { id: 'asc' }],
    });
    return matches.map(hydrate);
  }

  async generate(sessionId: number, dto: GenerateQueueDto) {
    const rounds = dto.rounds ?? 1;

    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException(`Session ${sessionId} not found`);

    const sessionPlayers = await this.prisma.sessionPlayer.findMany({
      where: { sessionId, player: { active: true } },
      include: { player: true },
    });
    if (sessionPlayers.length < 4) {
      throw new BadRequestException('need at least 4 active players');
    }

    const sessionCourts = await this.prisma.sessionCourt.findMany({
      where: { sessionId, court: { status: { not: 'closed' } } },
      include: { court: true },
    });

    const lastRound = await this.prisma.queueMatch.aggregate({
      where: { sessionId },
      _max: { roundNo: true },
    });
    let nextRound = (lastRound._max.roundNo ?? 0) + 1;

    const counts = new Map<number, number>(
      sessionPlayers.map((sp) => [sp.playerId, sp.gamesPlayed]),
    );

    const created: Hydrated[] = [];

    await this.prisma.$transaction(async (tx) => {
      for (let r = 0; r < rounds; r++) {
        const players: PairingPlayer[] = sessionPlayers.map((sp) => ({
          id: sp.playerId,
          gamesPlayed: counts.get(sp.playerId) ?? 0,
        }));
        const matches = buildRoundRobinRound(
          players,
          sessionCourts.length || Math.floor(players.length / 4),
        );

        for (let m = 0; m < matches.length; m++) {
          const match = matches[m];
          const courtId = sessionCourts[m]?.courtId ?? null;
          const row = await tx.queueMatch.create({
            data: {
              sessionId,
              roundNo: nextRound,
              courtId,
              teamA: match.teamA.join(','),
              teamB: match.teamB.join(','),
            },
            include: { court: true },
          });
          for (const pid of [...match.teamA, ...match.teamB]) {
            counts.set(pid, (counts.get(pid) ?? 0) + 1);
            await tx.sessionPlayer.update({
              where: { sessionId_playerId: { sessionId, playerId: pid } },
              data: { gamesPlayed: { increment: 1 } },
            });
          }
          created.push(hydrate(row));
        }
        nextRound++;
      }
    });

    return { created };
  }

  async updateMatch(id: number, dto: UpdateMatchDto) {
    const m = await this.prisma.queueMatch.findUnique({ where: { id } });
    if (!m) throw new NotFoundException(`Match ${id} not found`);
    const updated = await this.prisma.queueMatch.update({
      where: { id },
      data: { status: dto.status, courtId: dto.courtId },
      include: { court: true },
    });
    return hydrate(updated);
  }

  async resetSession(sessionId: number) {
    await this.prisma.queueMatch.deleteMany({ where: { sessionId } });
    await this.prisma.sessionPlayer.updateMany({
      where: { sessionId },
      data: { gamesPlayed: 0 },
    });
  }
}
