import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchModule } from './Match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MatchModule,
  ],
  providers: [],
})
export class AppModule { }
