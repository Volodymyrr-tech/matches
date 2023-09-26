import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Match {
  @Prop()
  homeTeam: string;

  @Prop()
  awayTeam: string;

  @Prop()
  homeScore: number;

  @Prop()
  awayScore: number;
}

export const MatchesSchema = SchemaFactory.createForClass(Match);
