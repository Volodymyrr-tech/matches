import { MatchDto } from '../Dto/match.dto';
import { TourService } from './tour.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
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

  @Get('get-matches-of-team/:teamName')
  getMatchesByTeam(@Param('teamName') teamName: string): MatchDto[] {
    try {
      return this.tourService.getMatchesByTeam(teamName);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('add-tour')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addTour(@Body() matchDto: MatchDto[]) {
    return this.tourService.addTour(matchDto);
  }

  @Put('update-scores/:id')
  updateScores(
    @Param('id') id: number,
    @Body('homeScore')
    homeScore: number,
    @Body('awayScore')
    awayScore: number,
  ) {
    return this.tourService.updateScoresById(id, homeScore, awayScore);
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
