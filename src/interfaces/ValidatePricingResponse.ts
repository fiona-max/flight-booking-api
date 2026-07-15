export interface LocationInfo {
  cityCode: string;
  countryCode: string;
}

export interface Dictionaries {
  locations: Record<string, LocationInfo>;
}

export interface IncludedCheckedBags {
  quantity: number;
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: IncludedCheckedBags;
}

export interface Tax {
  amount: string;
  code: string;
}

export interface TravelerPrice {
  currency: string;
  total: string;
  base: string;
  taxes: Tax[];
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: TravelerPrice;
  fareDetailsBySegment: FareDetailsBySegment[];
}

export interface Fee {
  amount: string;
  type: string;
}

export interface FlightPrice {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
  billingCurrency: string;
}

export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface Aircraft {
  code: string;
}

export interface Operating {
  carrierCode: string;
}

export interface FlightEndpoint {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface FlightSegment {
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating: Operating;
  id: string;
  numberOfStops: number;
  duration: string;
}

export interface Itinerary {
  segments: FlightSegment[];
}

export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  lastTicketingDate: string;
  itineraries: Itinerary[];
  price: FlightPrice;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
  paymentCardRequired: boolean;
}

export interface FlightOffersPricingData {
  type: string;
  flightOffers: FlightOffer[];
}

export interface ValidatePricingResponse {
  data: FlightOffersPricingData;
  dictionaries: Dictionaries;
}