export interface BookingRequest {
  name: string;
  email: string;
  startTime: string; // ISO 8601 format in UTC timezone (e.g., 2025-05-28T07:02:00.000Z)
  phoneNumber: string;
  location: string; // (e.g., Zoom, In-person)
  metadata?: object; // Additional metadata for the booking
  timeZone: string; // (e.g., America/New_York)
}
