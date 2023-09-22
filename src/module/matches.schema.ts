import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MatchDocument = HydratedDocument<Match>;

@Schema({ collection: 'Matches' })
export class Match extends Document {
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

// export interface Match extends mongoose.Document {
//   homeTeam: string;
//   awayTeam: string;
//   homeScore: number;
//   awayScore: number;
// }
