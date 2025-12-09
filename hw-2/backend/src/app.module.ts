import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionService } from './session.service';
import { SessionGateway } from './session.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/socket.io*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SessionService, SessionGateway],
})
export class AppModule { }
