import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getCountries() {
    const baseUrl = this.configService.get<string>('COUNTRIES_API_URL');
    const apiKey = this.configService.get<string>('COUNTRIES_API_KEY');

    if (!baseUrl) {
      throw new InternalServerErrorException(
        'COUNTRIES_API_URL is not defined',
      );
    }

    const allCountries: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    try {
      while (hasMore) {
        const url = `${baseUrl}?limit=${limit}&offset=${offset}`;
        this.logger.log(`Fetching countries from ${url}`);

        const response = await firstValueFrom(
          this.httpService.get(url, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }),
        );

        // Standard REST Countries API structure check
        const payload = response.data?.data;
        const objects = payload?.objects;

        if (Array.isArray(objects) && objects.length > 0) {
          allCountries.push(...objects);
        } else {
          this.logger.warn(
            `No objects array found at offset ${offset}. Full response structure: ${JSON.stringify(response.data)}`,
          );
          break; // Stop the loop if no data is found to prevent an infinite loop
        }

        // Move to the next page if 'more' is true
        hasMore = payload?.meta?.more ?? false;
        offset += limit;
      }

      this.logger.log(
        `Successfully fetched a total of ${allCountries.length} countries.`,
      );
      return allCountries;
    } catch (error) {
      this.logger.error(`Failed to fetch countries: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch country data');
    }
  }
}
