import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import {
  BookingAvailabilityRequest,
  BookingEvent,
} from 'src/interface/IBooking';
import { BookingRequest } from 'src/request/BookingRequest';

@Controller('cal')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/availability')
  async getAvailability(@Body() requestBody: BookingAvailabilityRequest) {
    try {
      console.log(new Date().toISOString());
      console.log('Getting availability for', requestBody.days, 'days');
      console.log('Timezone:', requestBody.timezone);
      const result = await this.bookingService.getAvailability(
        requestBody.days,
        requestBody.timezone,
      );
      console.log(new Date().toISOString());
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch availability',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/booking')
  async createBooking(@Body() bookingData: BookingRequest) {
    try {
      //log the current date time
      console.log(new Date().toISOString());
      console.log('Creating booking for', bookingData);
      // return {
      //   success: true,
      //   message: 'Booking created successfully',
      //   booking: 'Booking done successfully',
      // };
      console.log('Creating booking for', bookingData);
      const result = await this.bookingService.createBooking(bookingData);
      console.log('Booking response', result);
      console.log(new Date().toISOString());
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to create booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/cancel')
  async cancelBooking(@Body() cancelData: any) {
    try {
      console.log('Cancelling booking for', cancelData);
      const result = await this.bookingService.cancelBookingByUser(cancelData);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to cancel booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/booking')
  async getBooking(@Query() query: any) {
    try {
      console.log('Fetching booking for', query);
      const result = await this.bookingService.getBooking(query);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch booking information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
