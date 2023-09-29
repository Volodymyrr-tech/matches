import { MongooseModule } from '@nestjs/mongoose';
import { MatchesSchema } from './match.schema';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchesSchema }]),
  ],
})
export class DbModule {}
