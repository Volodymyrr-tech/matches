import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchModule } from './Match/match.module';
import { TourModule } from './tour/tour.module';
import { DbModule } from './Database/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MatchModule,
    TourModule,
    DbModule,
  ],
  providers: [],
})
export class AppModule {}
