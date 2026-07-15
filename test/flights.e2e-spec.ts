import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FlightsService } from '../src/modules/flights/service/flights.service';

describe('FlightsController (e2e)', () => {
  let app: INestApplication;
  let flightsService: FlightsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    flightsService = moduleFixture.get<FlightsService>(FlightsService);
    await app.init();
  });

  describe('/api/flights/book (POST)', () => {
    it('should return 400 if flightOffer or travelers are missing', () => {
      return request(app.getHttpServer())
        .post('/api/flights/book')
        .send({})
        .expect(400);
    });

    it('should call flightsService.bookFlight and return the result (with data wrapper)', async () => {
      const mockFlightOffer = { id: '1', price: { total: '100' } };
      const mockTravelers = [{ id: '1', name: { firstName: 'John', lastName: 'Doe' } }];
      const mockResponse = { data: { id: 'booking123', type: 'flight-order' } };

      jest.spyOn(flightsService, 'bookFlight').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/api/flights/book')
        .send({
          data: {
            flightOffer: mockFlightOffer,
            travelers: mockTravelers,
          },
        })
        .expect(201);

      expect(response.body).toEqual(mockResponse);
      expect(flightsService.bookFlight).toHaveBeenCalledWith(mockFlightOffer, mockTravelers);
    });

    it('should call flightsService.bookFlight and return the result (without data wrapper)', async () => {
      const mockFlightOffer = { id: '2', price: { total: '200' } };
      const mockTravelers = [{ id: '2', name: { firstName: 'Jane', lastName: 'Smith' } }];
      const mockResponse = { data: { id: 'booking456', type: 'flight-order' } };

      jest.spyOn(flightsService, 'bookFlight').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/api/flights/book')
        .send({
          flightOffer: mockFlightOffer,
          travelers: mockTravelers,
        })
        .expect(201);

      expect(response.body).toEqual(mockResponse);
      expect(flightsService.bookFlight).toHaveBeenCalledWith(mockFlightOffer, mockTravelers);
    });

    it('should handle errors from flightsService', async () => {
      const mockFlightOffer = { id: '1' };
      const mockTravelers = [{ id: '1' }];
      
      jest.spyOn(flightsService, 'bookFlight').mockRejectedValue(new Error('Amadeus error'));

      await request(app.getHttpServer())
        .post('/api/flights/book')
        .send({
          flightOffer: mockFlightOffer,
          travelers: mockTravelers,
        })
        .expect(500);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
