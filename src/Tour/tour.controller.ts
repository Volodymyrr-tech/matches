import { MatchDto } from '../Dto/match.dto';
import { TourService } from './tour.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}
  @Get()
  async getSchedule(): Promise<MatchDto[]> {
    console.log('Tournaments');
    return this.tourService.getSchedule();
  }

  @Get(':id')
  getTourById(@Param('id') id: string): MatchDto[] {
    const tourId = parseInt(id, 10);
    const tour = this.tourService.getTourById(tourId);
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }

    return tour;
  }

  @Post('add-tour')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addTour(@Body() matchDto: MatchDto[]) {
    return this.tourService.addTour(matchDto);
  }

  @Delete(':id')
  deleteTour(@Param('id') id: string) {
    const matchId = parseInt(id, 10);
    try {
      return this.tourService.deleteTour(matchId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while deleting the match',
        );
      }
    }
  }
}
