import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './matches.schema';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
  ) {}

  async create(createMatchDto: any): Promise<Match> {
    const createdMatch = new this.matchModel(createMatchDto);
    return createdMatch.save();
  }

  async findAll(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }
}
