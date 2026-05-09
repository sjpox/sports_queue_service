# sports-queue-service

NestJS + Prisma + MySQL API for the sports-queue app (pickleball / badminton).

Frontend lives in the sibling repo `sports_queue_app` (Vite + React + Redux Toolkit + TypeScript).

## Setup

```bash
cp .env.example .env                     # set DATABASE_URL
npm install
npx prisma migrate dev --name init       # create database + tables (or: npm run prisma:push)
npm run prisma:seed                      # optional: load demo players + courts
npm run start:dev                        # http://localhost:4000
```

### .env

```
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/sports_queue"
```

## Modules

```
src/
├── prisma/        PrismaService (global)
├── players/       CRUD: skill 1-5, sport, active flag
├── courts/        CRUD: name, sport, status, hourly_rate
├── sessions/      create with courts + players, list, expense forecast
└── queue/         round-robin generator, match status updates
```

## Endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET / POST / PUT / DELETE | `/api/players` | manage players |
| GET / POST / PUT / DELETE | `/api/courts` | manage courts |
| GET | `/api/sessions` | list sessions |
| GET | `/api/sessions/:id` | session detail (with courts + players) |
| POST | `/api/sessions` | create session |
| GET | `/api/sessions/:id/expense-forecast` | court_cost + shuttle + misc, per-player split |
| GET | `/api/queue/session/:id` | list generated matches |
| POST | `/api/queue/session/:id/generate` | round-robin generator (`{ rounds }`) |
| PUT | `/api/queue/match/:id` | update match `{ status, courtId }` |
| DELETE | `/api/queue/session/:id` | reset queue + game counts |

The queue uses fair rotation: players with the fewest games played are seated first each round, in groups of 4 (one match per available court). Remainders sit out and get priority next round.

## Stack

- NestJS 11 (TypeScript, decorators, ValidationPipe)
- Prisma 5 + `mysql2`
- `class-validator` DTOs
- Jest (unit + e2e)
