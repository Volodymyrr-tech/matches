import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { MatchModule } from '../Match/match.module';
import { Match, MatchesSchema } from '../DB/match.schema';
import { MatchDto } from '../Match/dto/match.dto';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchesSchema }]),
    MatchModule,
    Match,
    MatchDto,
  ],
  providers: [TourService],
  controllers: [TourController],
})
export class TourModule {}
