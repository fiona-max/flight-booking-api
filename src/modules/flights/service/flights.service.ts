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
  async validatePricing(flightOffer: any): Promise<ValidatePricingResponse> {
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


// // flights.service.ts
// import { Injectable, BadRequestException, Logger, Inject } from '@nestjs/common';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import type { Cache } from 'cache-manager';
//
// import AmadeusService from '../../../providers/amadeus/amadeus.service';
// import {
//   SearchFlightsDto,
//   SearchFlightsResponse,
// } from '../../../interfaces/search-flights.dto';
// import { SearchCityandAirportResponse } from '../../../interfaces/searchCityandAirportResponse';
// import { CountriesService } from '../../../providers/countries/countries.service';
// import { ValidatePricingResponse } from '../../../interfaces/ValidatePricingResponse';
// import { AirlineData } from '../../../interfaces/airlineResponseBody';
// import { FlightOfferPayload } from '../../../interfaces/FlightOfferPayload';
//
// @Injectable()
// export class FlightsService {
//   private readonly logger = new Logger(FlightsService.name);
//
//   constructor(
//     @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
//     private readonly amadeusService: AmadeusService,
//     private readonly countriesService: CountriesService,
//   ) {}
//
//   async getFlights(
//     criteria: SearchFlightsDto,
//   ): Promise<SearchFlightsResponse[]> {
//     const { originCode, destinationCode, departureDate, adults } = criteria;
//
//     // 2. Generate a structured Redis key based on search variables
//     const cacheKey =
//       `flights:${originCode}:${destinationCode}:${departureDate}:adults-${adults}`.toLowerCase();
//
//     try {
//       // 3. Try reading from Redis first
//       const cachedFlights =
//         await this.cacheManager.get<SearchFlightsResponse[]>(cacheKey);
//       if (cachedFlights) {
//         this.logger.log(`⚡ Redis Cache Hit for Flights: ${cacheKey}`);
//         return cachedFlights;
//       }
//     } catch (error) {
//       this.logger.warn(`Redis failed to read: ${error.message}`);
//     }
//
//     this.logger.log(
//       `🔄 Cache Miss. Fetching fresh flight data from Amadeus: ${cacheKey}`,
//     );
//     const flights = await this.amadeusService.searchFlights(criteria);
//
//     try {
//       // 4. Cache live results (expires in 10 minutes / 600,000 ms to handle pricing updates)
//       await this.cacheManager.set(cacheKey, flights, 600000);
//     } catch (error) {
//       this.logger.warn(`Redis failed to write: ${error.message}`);
//     }
//
//     return flights;
//   }
//
//   async getCityAndAirport(
//     keyword: string,
//   ): Promise<SearchCityandAirportResponse[]> {
//     const sanitizedKeyword = keyword.trim().toLowerCase();
//     const cacheKey = `locations:${sanitizedKeyword}`;
//
//     try {
//       // 5. Try reading airport auto-complete query from cache
//       const cachedLocations =
//         await this.cacheManager.get<SearchCityandAirportResponse[]>(cacheKey);
//       if (cachedLocations) {
//         this.logger.log(
//           `⚡ Redis Cache Hit for Airport Lookup: "${sanitizedKeyword}"`,
//         );
//         return cachedLocations;
//       }
//     } catch (error) {
//       this.logger.warn(`Redis failed to read: ${error.message}`);
//     }
//
//     const locations = await this.amadeusService.searchLocations(keyword);
//
//     try {
//       // 6. Cache lookups for longer (e.g., 24 hours / 86,400,000 ms) since airport data changes rarely
//       await this.cacheManager.set(cacheKey, locations, 86400000);
//     } catch (error) {
//       this.logger.warn(`Redis failed to write: ${error.message}`);
//     }
//
//     return locations;
//   }
//
//   async validatePricing(flightOffer: any): Promise<ValidatePricingResponse> {
//     // Pricing validation should NOT be cached, as pricing check requires fresh validation from the GDS/airline
//     return this.amadeusService.validatePricing(flightOffer);
//   }
//
//   getCountries() {
//     return this.countriesService.getCountries();
//   }
//
//   getAirlineCodes(airlineCodes: string): Promise<AirlineData[]> {
//     return this.amadeusService.getAirlineByCode(airlineCodes);
//   }
//
//   async bookFlight(flightOffer: any, travelers: any[]): Promise<any> {
//     return this.amadeusService.bookFlight(flightOffer, travelers);
//   }
// }
