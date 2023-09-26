import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchModule } from './Match/match.module';
import { StatisticsModule } from './Stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MatchModule,
    StatisticsModule,
  ],
  providers: [],
})
export class AppModule { }
