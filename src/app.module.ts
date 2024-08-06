import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { HttpModule } from '@nestjs/axios';
import { FipeService } from './services/app.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [FipeService],
})
export class AppModule {}
