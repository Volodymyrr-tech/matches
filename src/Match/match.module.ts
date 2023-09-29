import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchesSchema } from '../Database/match.schema';
import { MatchController } from './match.controller';
import { MatchDto } from '../Dto/match.dto';
import { DbModule } from '../Database/db.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchesSchema }]),
    DbModule,
  ],
  controllers: [MatchController],
  providers: [MatchService, Match, MatchDto],
  exports: [MatchService, Match, MatchDto],
})
export class MatchModule {}
