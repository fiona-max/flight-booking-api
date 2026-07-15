import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import AmadeusService from '../../../providers/amadeus/amadeus.service';
import {
  SearchFlightsDto,
  SearchFlightsResponse,
} from '../../../interfaces/search-flights.dto';
import { SearchCityandAirportResponse } from '../../../interfaces/searchCityandAirportResponse';
import { CountriesService } from '../../../providers/countries/countries.service';
import { ValidatePricingResponse } from '../../../interfaces/ValidatePricingResponse';
import { AirlineData } from '../../../interfaces/airlineResponseBody';
import { FlightOfferPayload } from '../../../interfaces/FlightOfferPayload';

@Injectable()
export class FlightsService {
  private readonly logger = new Logger(FlightsService.name);
  constructor(
    private readonly amadeusService: AmadeusService,
    private readonly countriesService: CountriesService,
  ) {}
  getFlights(criteria: SearchFlightsDto): Promise<SearchFlightsResponse[]> {
    return this.amadeusService.searchFlights(criteria);
  }
  getCityAndAirport(keyword: string): Promise<SearchCityandAirportResponse[]> {
    return this.amadeusService.searchLocations(keyword);
  }
  async validatePricing(
    flightOffer: any,
  ): Promise<ValidatePricingResponse> {
    return this.amadeusService.validatePricing(flightOffer);
  }
  getCountries() {
    return this.countriesService.getCountries();
  }
  getAirlineCodes(airlineCodes: string): Promise<AirlineData[]> {
    return this.amadeusService.getAirlineByCode(airlineCodes);
  }
  async bookFlight(flightOffer: any, travelers: any[]): Promise<any> {
    return this.amadeusService.bookFlight(flightOffer, travelers);
  }
}
