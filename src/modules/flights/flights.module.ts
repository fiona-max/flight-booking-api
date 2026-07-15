import { Module } from '@nestjs/common';
import { FlightsController } from './controller/flights.controller';
import { FlightsService } from './service/flights.service';
import { AmadeusModule } from '../../providers/amadeus/amadeus.module';
import { CountriesModule } from '../../providers/countries/countries.module';

@Module({
  imports: [AmadeusModule, CountriesModule],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [FlightsService],
})
export class FlightsModule {}
