// import { Module } from '@nestjs/common';
// import { MatchService } from './matches.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { MatchesSchema } from './matches.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: 'Matches', schema: MatchesSchema }]),
//   ],
//   providers: [MatchService],
// })
// export class MatchesModule {}

import { Module, OnModuleInit } from '@nestjs/common';
import { MatchService } from './matches.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesSchema } from './matches.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Matches', schema: MatchesSchema }]),
  ],
  providers: [MatchService],
})
export class MatchesModule implements OnModuleInit {
  constructor(private readonly matchService: MatchService) {}

  async onModuleInit() {
    const matches = [
      { homeTeam: 'Real', awayTeam: 'Milan', homeScore: 3, awayScore: 1 },
      { homeTeam: 'Ajax', awayTeam: 'Barcelona', homeScore: 2, awayScore: 0 },
      { homeTeam: 'Ajax', awayTeam: 'Real', homeScore: 1, awayScore: 1 },
      { homeTeam: 'Milan', awayTeam: 'Barcelona', homeScore: 0, awayScore: 0 },
      { homeTeam: 'Barcelona', awayTeam: 'Real', homeScore: 1, awayScore: 0 },
      { homeTeam: 'Milan', awayTeam: 'Ajax', homeScore: 2, awayScore: 1 },
    ];
    for (const match of matches) {
      await this.matchService.create(match);
    }
  }
}
