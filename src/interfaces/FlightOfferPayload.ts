export interface FlightOfferPayload {
  data: FlightOffersPricingData;
}

export interface FlightOffersPricingData {
  type: string;
  flightOffers: FlightOffer[];
}

export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string; // Consider using Date if you parse it downstream
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: PriceDetails;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface Itinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightSegment {
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
  duration: string;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating: OperatingCarrier;
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
}

export interface FlightEndpoint {
  iataCode: string;
  terminal?: string; // Optional since some smaller airports don't use terminals
  at: string; // ISO DateTime string
}

export interface Aircraft {
  code: string;
}

export interface OperatingCarrier {
  carrierCode: string;
}

export interface PriceDetails {
  currency: string;
  total: string;
  base: string;
  grandTotal: string;
  fees: Fee[];
}

export interface Fee {
  amount: string;
  type: string;
}

export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: TravelerPrice;
  fareDetailsBySegment: FareDetailsBySegment[];
}

export interface TravelerPrice {
  currency: string;
  total: string;
  base: string;
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: IncludedCheckedBags;
}

export interface IncludedCheckedBags {
  weight: number;
  weightUnit: string;
}
