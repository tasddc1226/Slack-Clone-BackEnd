import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from '../entities/Users';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';

@Module({
  imports: [TypeOrmModule.forFeature([Users, ChannelMembers, WorkspaceMembers])],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
