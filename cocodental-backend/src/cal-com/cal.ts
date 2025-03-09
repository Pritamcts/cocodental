import 'dotenv/config';
// import * as moment from 'moment';
import * as moment from 'moment-timezone';

// Environment variable validation
if (!process.env.CALCOM_API_KEY) {
  throw new Error('CALCOM_API_KEY is required');
}
if (!process.env.CALCOM_EVENT_TYPE_ID) {
  throw new Error('CALCOM_EVENT_TYPE_ID is required');
}

const BASE_URL = 'https://api.cal.com/v2';

interface Config {
  apiKey: string;
  eventTypeId: number;
}

export interface Attendee {
  name: string;
  email: string;
  timeZone: string;
  phoneNumber?: string;
  language?: string;
}

export interface BookingRequest {
  start: string;
  lengthInMinutes?: number;
  eventTypeId?: number;
  attendee: Attendee;
  guests?: string[];
  meetingUrl?: string;
  location?: string;
  metadata?: Record<string, any>;
  bookingFieldsResponses?: Record<string, any>;
}

export interface BookingResponse {
  status: boolean;
  booking?: any;
  error?: string;
  message?: string;
}

const config: Config = {
  apiKey: process.env.CALCOM_API_KEY,
  eventTypeId: parseInt(process.env.CALCOM_EVENT_TYPE_ID, 10),
};

export async function getAvailability(
  days: number = 5,
  timezone: string,
): Promise<
  | { success: boolean; availability: { slots: any[] } }
  | { success: false; error: string }
> {
  try {
    const startTime = new Date().toISOString();
    const endTime = moment().add(days, 'days').toISOString();

    const params = new URLSearchParams({
      startTime,
      endTime,
      eventTypeId: config.eventTypeId.toString(),
    });

    const url = `${BASE_URL}/slots/available?${params}`;

    console.log('Fetching availability from:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch availability:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Availability response:', JSON.stringify(data, null, 2));

    if (data.status !== 'success' || !data.data?.slots) {
      throw new Error('Invalid response format');
    }

    const slots = Object.values(data.data.slots).flat();
    //Code to convert the time in each slot to specific timezone. here timezone will be the input in the request
    slots.forEach((slot: any) => {
      slot.time = moment(slot.time).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    });
    console.log(slots);
    return {
      success: true,
      availability: { slots },
    };
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return {
      success: false,
      error: 'Failed to fetch availability',
    };
  }
}

export async function createBooking(
  bookingData: BookingRequest,
): Promise<BookingResponse> {
  try {
    const eventTypeId = bookingData.eventTypeId || config.eventTypeId;

    const { eventTypeId: _, ...requestData } = bookingData;

    const requestBody = {
      ...requestData,
      eventTypeId,
    };

    const url = `${BASE_URL}/bookings`;

    console.log('Creating booking:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'cal-api-version': '2024-08-13',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create booking:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to create booking: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Booking response:', JSON.stringify(data, null, 2));

    return {
      status: true,
      // booking: data,
      message: 'Booking created successfully',
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return {
      status: false,
      message: 'Booking failed',
      error:
        error instanceof Error ? error.message : 'Failed to create booking',
    };
  }
}

export async function cancelBookingByUser(
  attendeeName: string,
  attendeeEmail: string,
  cancellationReason?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const bookingResponse = await getBooking(attendeeName, attendeeEmail);

    if (!bookingResponse.success || !bookingResponse.booking?.data?.uid) {
      throw new Error('Booking not found or failed to retrieve booking UUID');
    }

    const bookingUid = bookingResponse.booking.data.uid;
    let url = `https://api.cal.com/v2/bookings/${bookingUid}/cancel`;

    const requestBody: any = {
      reason: cancellationReason || 'User requested cancellation',
    };

    console.log('Cancelling booking:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to cancel booking:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to cancel booking: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Cancellation result:', result);

    return { success: true };
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to cancel booking',
    };
  }
}

export async function getBooking(
  attendeeName: string,
  attendeeEmail: string,
  status: string = 'upcoming',
): Promise<{ success: boolean; booking?: any; error?: string }> {
  try {
    const params = new URLSearchParams({
      eventTypeId: config.eventTypeId.toString(),
      attendeeName,
      attendeeEmail,
      status,
    });

    const url = `${BASE_URL}/bookings?${params.toString()}`;
    console.log('Fetching booking from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'cal-api-version': '2024-08-13',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch booking:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch booking: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Booking response:', JSON.stringify(data, null, 2));

    return {
      success: true,
      booking: data,
    };
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch booking',
    };
  }
}
