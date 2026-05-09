import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.queueMatch.deleteMany();
  await prisma.sessionPlayer.deleteMany();
  await prisma.sessionCourt.deleteMany();
  await prisma.session.deleteMany();
  await prisma.player.deleteMany();
  await prisma.court.deleteMany();

  await prisma.player.createMany({
    data: [
      { name: 'Alex',   sport: 'badminton',  skillLevel: 4, active: true },
      { name: 'Bea',    sport: 'badminton',  skillLevel: 3, active: true },
      { name: 'Carlo',  sport: 'both',       skillLevel: 5, active: true },
      { name: 'Dani',   sport: 'pickleball', skillLevel: 2, active: true },
      { name: 'Ella',   sport: 'badminton',  skillLevel: 3, active: true },
      { name: 'Felix',  sport: 'both',       skillLevel: 4, active: true },
      { name: 'Gia',    sport: 'pickleball', skillLevel: 3, active: true },
      { name: 'Hugo',   sport: 'badminton',  skillLevel: 2, active: true },
    ],
  });

  await prisma.court.createMany({
    data: [
      { name: 'Court 1', sport: 'badminton',  status: 'available', hourlyRate: 250 },
      { name: 'Court 2', sport: 'badminton',  status: 'available', hourlyRate: 250 },
      { name: 'Court 3', sport: 'pickleball', status: 'available', hourlyRate: 300 },
    ],
  });

  console.log('Seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
