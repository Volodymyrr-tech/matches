import { Module } from '@nestjs/common';
import { MatchService } from './matches.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesSchema } from './matches.schema';
import { MatchController } from './matches.contoller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchesSchema }]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
