import { Module } from '@nestjs/common';
import { DMsService } from './dms.service';
import { DMsController } from './dms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMs } from 'src/entities/DMs';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([DMs, Users, Workspaces]), EventsModule],
  providers: [DMsService],
  controllers: [DMsController]
})
export class DmsModule { }
