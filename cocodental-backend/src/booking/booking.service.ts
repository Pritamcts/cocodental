import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import {
  getAvailability,
  createBooking,
  cancelBookingByUser,
  getBooking,
} from 'src/cal-com/cal';
import { BookingEvent } from 'src/interface/IBooking';
import { BookingRequest } from 'src/request/BookingRequest';

@Injectable()
export class BookingService {
  private config = {
    apiKey: process.env.CALCOM_API_KEY,
    eventTypeId: !!process.env.CALCOM_EVENT_TYPE_ID
      ? parseInt(process.env.CALCOM_EVENT_TYPE_ID, 10)
      : 0,
  };

  private formatTimeToISO(timeInput: string) {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(timeInput)) {
      return timeInput;
    }
    const date = moment(timeInput);
    if (!date.isValid()) {
      throw new Error('Invalid date format');
    }
    return date.format('YYYY-MM-DDTHH:MM:SS[Z]');
  }

  convertToUtc(timeZone: string, timeInput: string): string {
    try {
      return moment
        .tz(timeInput, timeZone)
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss[Z]');
    } catch (e) {
      throw new Error('Invalid timezone or date format');
    }
  }

  async getAvailability(days: any, timezone: string) {
    return await getAvailability(days, timezone);
  }

  async createBooking(bookingData: BookingRequest) {
    const formattedStartTime = this.convertToUtc(
      bookingData.timeZone,
      bookingData.startTime,
    );
    const bookingDataFormatted = {
      start: formattedStartTime,
      eventTypeId: this.config.eventTypeId,
      attendee: {
        name: bookingData.name,
        email: bookingData.email,
        timeZone: bookingData.timeZone || 'America/New_York',
        phoneNumber: bookingData.phoneNumber || '',
        language: 'en',
      },
      // guests: bookingData.guests || [],
      location: bookingData.location || 'Zoom',
      metadata: bookingData.metadata || {},
    };
    return await createBooking(bookingDataFormatted);
  }

  async cancelBookingByUser(cancelData: any) {
    return await cancelBookingByUser(
      cancelData.attendeeName,
      cancelData.attendeeEmail,
      cancelData.cancellationReason,
    );
  }

  async getBooking(query: any) {
    return await getBooking(
      query.attendeeName,
      query.attendeeEmail,
      query.status,
    );
  }
}
