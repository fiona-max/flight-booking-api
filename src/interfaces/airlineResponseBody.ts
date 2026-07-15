export interface AirlineResponseBody {
  meta: {
    count: number;
    links: {
      self: string;
    };
  };
  data: AirlineData[];
}
export interface AirlineData {
  type: string;
  iataCode: string;
  icaoCode: string;
  businessName: string;
  commonName: string;
}
