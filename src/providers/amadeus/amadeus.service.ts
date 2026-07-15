import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchFlightsDto, SearchFlightsResponse } from '../../interfaces/search-flights.dto';
import Amadeus from 'amadeus';
import { SearchCityandAirportResponse } from '../../interfaces/searchCityandAirportResponse';
import { ValidatePricingResponse } from '../../interfaces/ValidatePricingResponse';
import { AirlineData, AirlineResponseBody, } from '../../interfaces/airlineResponseBody';

@Injectable()
class AmadeusService {
  private readonly logger = new Logger(AmadeusService.name);

  // Replace this with your actual Amadeus initialization logic
  private amadeus: any;

  constructor(private configService: ConfigService) {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
    this.amadeus = new Amadeus({
      clientId: this.configService.get('AMADEUS_CLIENT_ID'),
      clientSecret: this.configService.get('AMADEUS_CLIENT_SECRET'),
    });
  }
  async searchLocations(
    keyword: string,
  ): Promise<SearchCityandAirportResponse[]> {
    if (!keyword || !keyword.trim()) {
      this.logger.warn('No keyword provided for location search');
      return [];
    }
    try {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      const response: any = await this.amadeus.referenceData.locations.get({
        keyword,
        subType: 'AIRPORT,CITY',
        // max: 10,
      });
      this.logger.debug(`🌐 Amadeus location search response received`);
      const data = response?.data as SearchCityandAirportResponse[];
      return data || [];
    } catch (error: any) {
      console.log(`Amadeus location search error: ${error.message}`);
      this.logger.error(`Amadeus location search failed`, error.stack);
      throw new InternalServerErrorException(
        `Failed to fetch locations: ${error?.response?.data?.errors?.[0]?.detail || 'Unknown error from Amadeus'}`,
      );
    }
  }

  async searchFlights(
    criteria: SearchFlightsDto,
  ): Promise<SearchFlightsResponse[]> {
    const {
      originCode,
      destinationCode,
      departureDate,
      returnDate,
      adults,
      max,
    } = criteria;

    this.logger.log(
      `Calling Amadeus with: ${JSON.stringify({ originCode, destinationCode, departureDate, returnDate, adults, max })}`,
    );

    // Construct params cleanly using TypeScript record types
    const params: Record<string, any> = {
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate,
      adults: Number(adults),
      max: max || 20,
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    try {
      // Execute the external Amadeus API call
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      const response: any =
        await this.amadeus.shopping.flightOffersSearch.get(params);

      // Log responses using NestJS Logger syntax
      this.logger.debug(`Amadeus Raw Response received`);
      this.logger.debug(`Response.data length: ${response?.data?.length || 0}`);

      const data = response?.data as SearchFlightsResponse[];
      return data || [];
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Amadeus flight search failed`, error.stack);
      // NestJS best practice: Map external errors to HTTP Exceptions
      throw new InternalServerErrorException(
        'Failed to fetch flight offers from provider.',
      );
    }
  }

  async getAirlineByCode(airlineCodes: string): Promise<AirlineData[]> {
    if (!airlineCodes) {
      this.logger.warn(`No airline was found with this code ${airlineCodes}`);
    }
    try {
      const results: AirlineResponseBody =
        await this.amadeus.referenceData.airlines.get({
          airlineCodes,
        });
      console.log(results);
      return results.data as AirlineData[];
    } catch (error: any) {
      this.logger.error(`Amadeus airline search failed`, error);
      throw new InternalServerErrorException(
        'Failed to fetch airline from provider.',
      );
    }
  }

  // amadeus.service.ts
  async validatePricing(
    flightOffer: any,
  ): Promise<ValidatePricingResponse> {
    console.log(flightOffer);
    if (!flightOffer) {
      console.log(flightOffer);
      throw new BadRequestException('No flight offer was provided for pricing');
    }
    try {
      console.log('flight received', flightOffer);
      const response = await this.amadeus.shopping.flightOffers.pricing.post(
        {
          data: {
            type: 'flight-offers-pricing',
            flightOffers: [flightOffer],
          },
        }
      );
      // Amadeus SDK response.data contains the actual result
      return response.data;
    } catch (error: any) {
      console.error('Amadeus pricing full error object:', JSON.stringify(error, null, 2));
      this.logger.error('Amadeus pricing failed', error.stack);

      const statusCode = error.response?.statusCode || 500;
      // Amadeus SDK error object might have data in error.description for some error types
      // or error.response.body for others. Let's try to be more robust.
      let detail = 'Failed to validate flight pricing';
      
      if (error.response?.data?.errors?.[0]?.detail) {
        detail = error.response.data.errors[0].detail;
      } else if (error.description?.[0]?.detail) {
        detail = error.description[0].detail;
      } else if (error.message) {
        detail = error.message;
      }

      if (statusCode >= 500) {
        throw new InternalServerErrorException(detail);
      } else {
        throw new BadRequestException(detail);
      }
    }
  }

  async bookFlight(flightOffer: any, travelers: any[]): Promise<any> {
    if (!flightOffer || !travelers || travelers.length === 0) {
      throw new BadRequestException('Flight offer and travelers are required for booking');
    }

    try {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      const response = await this.amadeus.booking.flightOrders.post(
        JSON.stringify({
          data: {
            type: 'flight-order',
            flightOffers: [flightOffer],
            travelers,
          },
        }),
      );

      this.logger.log('Flight booking successful');
      return response.data;
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    } catch (error: any) {
      this.logger.error('Amadeus flight booking failed', error.stack);

      const statusCode = error.response?.statusCode || 500;
      let detail = 'Failed to book flight';

      if (error.response?.data?.errors?.[0]?.detail) {
        detail = error.response.data.errors[0].detail;
      } else if (error.description?.[0]?.detail) {
        detail = error.description[0].detail;
      } else if (error.message) {
        detail = error.message;
      }

      if (statusCode >= 500) {
        throw new InternalServerErrorException(detail);
      } else {
        throw new BadRequestException(detail);
      }
    }
  }
}

export default AmadeusService;
