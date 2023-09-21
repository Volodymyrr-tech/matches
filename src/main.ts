import { NestFactory } from '@nestjs/core';
import { MatchModule } from './module/matches.module';
import { MatchService } from './module/matches.service';

async function bootstrap() {
  const app = await NestFactory.create(MatchModule);

  const mongoose = app.get('MongooseInstance');
  mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const matchService = app.get(MatchService);
  const matches = [
    { homeTeam: 'Real', awayTeam: 'Milan', homeScore: 3, awayScore: 1 },
    { homeTeam: 'Ajax', awayTeam: 'Barcelona', homeScore: 2, awayScore: 0 },
    { homeTeam: 'Ajax', awayTeam: 'Real', homeScore: 1, awayScore: 1 },
    { homeTeam: 'Milan', awayTeam: 'Barcelona', homeScore: 0, awayScore: 0 },
    { homeTeam: 'Barcelona', awayTeam: 'Real', homeScore: 1, awayScore: 0 },
    { homeTeam: 'Milan', awayTeam: 'Ajax', homeScore: 2, awayScore: 1 },
  ];

  for (const match of matches) {
    await matchService.create(match);
  }

  await app.listen(3000);
}

bootstrap();
