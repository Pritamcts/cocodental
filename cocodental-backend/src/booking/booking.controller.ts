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
import { BookingEvent } from 'src/interface/IBooking';
import { BookingRequest } from 'src/request/BookingRequest';

@Controller('cal')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/availability')
  async getAvailability(@Body() days: any) {
    try {
      console.log('Getting availability for', days, 'days');
      const result = await this.bookingService.getAvailability(days);
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
      console.log('Creating booking for', bookingData);
      const result = await this.bookingService.createBooking(bookingData);
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
