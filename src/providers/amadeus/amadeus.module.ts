import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AmadeusService from './amadeus.service';

@Module({
  imports: [ConfigModule],
  providers: [AmadeusService],
  exports: [AmadeusService],
})
export class AmadeusModule {}
