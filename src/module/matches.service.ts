import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Match } from './matches.schema';

export interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<MatchData>,
  ) {}

  async create(createMatch: MatchData): Promise<MatchData> {
    const createdMatch = new this.matchModel(createMatch);
    return createdMatch.save();
  }

  async findAll(): Promise<MatchData[]> {
    return this.matchModel.find().exec();
  }
}
