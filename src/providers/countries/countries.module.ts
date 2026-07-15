import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CountriesService } from './countries.service';

@Module({
  imports: [HttpModule],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
