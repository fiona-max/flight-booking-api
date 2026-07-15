import { Test, TestingModule } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from '../service/flights.service';
import { SearchFlightsDto } from '../../../interfaces/search-flights.dto';

describe('FlightsController', () => {
  let controller: FlightsController;

  const mockFlightsService = {
    getFlights: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [
        {
          provide: FlightsService,
          useValue: mockFlightsService,
        },
      ],
    }).compile();

    controller = module.get<FlightsController>(FlightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFlights', () => {
    it('should call flightsService.getFlights with correct criteria', async () => {
      const criteria: SearchFlightsDto = {
        originCode: 'NYC',
        destinationCode: 'LON',
        departureDate: '2024-12-01',
        adults: 1,
      };
      const mockResult = [{ id: '1', price: '100' }];
      mockFlightsService.getFlights.mockResolvedValue(mockResult);

      const result = await controller.getFlights(criteria);

      expect(mockFlightsService.getFlights).toHaveBeenCalledWith(criteria);
      expect(result).toBe(mockResult);
    });
  });
});
