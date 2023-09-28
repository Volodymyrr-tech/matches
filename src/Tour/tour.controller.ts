import { MatchDto } from '../Match/dto/match.dto';
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
} from '@nestjs/common';

@Controller('tournaments')
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
  createMatch(@Body() createMatchDto: MatchDto): MatchDto {
    const addedMatch = this.tourService.addTournamentMatch(createMatchDto);

    return addedMatch;
  }

  @Delete(':id')
  deleteMatchById(@Param('id') id: string): void {
    // Parse the ID to an integer
    const matchId = parseInt(id, 10);

    try {
      // Call the service method to delete the match by ID
      this.tourService.deleteMatchById(matchId);
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
