import { Module } from '@nestjs/common';
import { MatchService } from './matches.service';
// import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesSchema } from './matches.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Matches', schema: MatchesSchema }]),
  ],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}

