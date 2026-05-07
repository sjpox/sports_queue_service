import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PlayersModule } from './players/players.module';
import { CourtsModule } from './courts/courts.module';
import { SessionsModule } from './sessions/sessions.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PlayersModule,
    CourtsModule,
    SessionsModule,
    QueueModule,
  ],
})
export class AppModule {}
