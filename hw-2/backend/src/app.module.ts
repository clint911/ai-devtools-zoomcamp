import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionService } from './session.service';
import { SessionGateway } from './session.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SessionService, SessionGateway],
})
export class AppModule { }
