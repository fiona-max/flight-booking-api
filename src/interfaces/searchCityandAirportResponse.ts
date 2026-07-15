export interface SearchCityandAirportResponse {
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
}
