import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017', {
      connectionName: 'Matches',
    }),
  ],
  providers: [],
})
export class AppModule {}
