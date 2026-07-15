import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FlightsService } from '../service/flights.service';
import {
  SearchFlightsDto,
  SearchFlightsResponse,
} from '../../../interfaces/search-flights.dto';
import * as FlightOfferPayload from '../../../interfaces/FlightOfferPayload';

@Controller('api/flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}
  @Get('search')
  getFlights(@Query() criteria: SearchFlightsDto) {
    return this.flightsService.getFlights(criteria);
  }
  @Get('locations')
  getCityAndAirport(@Query('keyword') keyword: string) {
    return this.flightsService.getCityAndAirport(keyword);
  }
  @Get('countries')
  getCountries() {
    return this.flightsService.getCountries();
  }
  @Post('validate-pricing')
  validatePricing(
    @Body() body: any,
  ) {
    const flightOffer = body.data?.flightOffers?.[0] || body.flightOffers?.[0] || body.flightOffer;
    return this.flightsService.validatePricing(flightOffer);
  }
  @Get('airlines')
  getAirlinesCodes(@Query('airlineCodes') airlineCodes: string) {
    return this.flightsService.getAirlineCodes(airlineCodes);
  }
  @Post('book')
  bookFlight(@Body() body: any) {
    const { flightOffer, travelers } = body.data || body;
    return this.flightsService.bookFlight(flightOffer, travelers);
  }
}
