import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';

@Module({
  // forRoot가 붙는 이유? => 추가적인 설정을 하기 위함
  imports: [ConfigModule.forRoot(), UsersModule, WorkspacesModule, ChannelsModule, DmsModule],
  controllers: [AppController],
  // providers가 존재하는 이유? => 여기에 연결되어 있도록 하기위해서 즉, 의존성 주입을 위함
  // 의존성 주입 (DI)를 그러면 왜하냐? => 코드의 재사용성을 높이기 위함.
  providers: [AppService],
})
export class AppModule implements NestModule {
  // middleware 들은 consumer에 연결
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
