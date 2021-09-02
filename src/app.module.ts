import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import * as ormconfig from './ormconfig';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';
import { UsersService } from './users/users.service';


@Module({
  // forRoot가 붙는 이유? => 추가적인 설정을 하기 위함
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        ChannelChats,
        ChannelMembers,
        Channels,
        DMs,
        Mentions,
        Users,
        WorkspaceMembers,
        Workspaces,
      ],
      migrations: [__dirname + '/src/migrations/*.ts'],
      cli: { migrationsDir: 'src/migrations' },
      autoLoadEntities: true,
      charset: 'utf8mb4',
      // 처음 서버 실행때는 true로 하고, 그 뒤로는 false
      synchronize: false, 
      // orm을 사용하여 개발할 때, loggin을 켜두면 orm이 sql에게 어떻게 쿼리를 날렸는지에 대한 정보를 알 수 있다.
      logging: true, 
      keepConnectionAlive: true,
    }),
    UsersModule, 
    WorkspacesModule, 
    ChannelsModule, 
    DmsModule, 
],
  controllers: [AppController],
  // providers가 존재하는 이유? => 여기에 연결되어 있도록 하기위해서 즉, 의존성 주입을 위함
  // 의존성 주입 (DI)를 그러면 왜하냐? => 코드의 재사용성을 높이기 위함.
  providers: [AppService, UsersService],
})
export class AppModule implements NestModule {
  // middleware 들은 consumer에 연결
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
