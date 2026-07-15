export class SearchFlightsDto {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate?: string; // Optional field
  adults: number | string;
  max?: number;
}

export class SearchFlightsResponse {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  isUpsellOffer: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}
export interface Itinerary {
  duration: string;
  segments: Segment[];
}
export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
  additionalServices?: AdditionalService[];
}

export interface Fee {
  amount: string;
  type: string;
}

export interface AdditionalService {
  amount: string;
  type: string;
}

export interface Segment {
  departure: FlightPoint;
  arrival: FlightPoint;
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface FlightPoint {
  iataCode: string;
  terminal?: string;
  at: string;
}
export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}
export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: FareDetailsBySegment[];
}
export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare: string;
  brandedFareLabel: string;
  class: string;
  includedCheckedBags?: {
    quantity: number;
  };
  includedCabinBags?: {
    quantity: number;
  };
  amenities?: Amenity[];
}

export interface Amenity {
  description: string;
  isChargeable: boolean;
  amenityType: string;
  amenityProvider: {
    name: string;
  };
}
