import * as mongoose from 'mongoose';

export const MatchesSchema = new mongoose.Schema({
  homeTeam: String,
  awayTeam: String,
  homeScore: Number,
  awayScore: Number,
});

export interface Match extends mongoose.Document {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}
