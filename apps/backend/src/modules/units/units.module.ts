import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { NombaModule } from '../nomba/nomba.module';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';

@Module({
  imports: [PrismaModule, RealtimeModule, NombaModule],
  providers: [UnitsService],
  controllers: [UnitsController],
})
export class UnitsModule {}
