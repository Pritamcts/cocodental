export interface Attendee {
  name: string;
  email: string;
  timeZone: string;
  phoneNumber: string;
  language: string;
}

export interface BookingEvent {
  start: string;
  attendee: Attendee;
  guests: any[];
  location: string;
  metadata: any;
  eventTypeId: number;
}

export interface BookingAvailabilityRequest {
  days: number;
  timezone: string;
}
