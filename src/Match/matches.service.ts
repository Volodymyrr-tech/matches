import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './matches.schema';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name)
    private readonly matchModel: Model<Match>,
  ) {}

  async create(match: Match[]): Promise<Match[]> {
    const res = await this.matchModel.create(match);
    console.log(res, 'service worked');
    return res;
  }

  async findAll(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }

  async findById(id: string): Promise<Match> {
    const match = await this.matchModel.findById(id);
    if (!match) {
      throw new NotFoundException('Match is not found!');
    }
    return match;
  }

  async updateById(id: string, match: Match): Promise<Match> {
    return await this.matchModel.findByIdAndUpdate(id, match, {
      new: true,
      runValidators: true,
    });
    if (!match) {
      throw new NotFoundException('Match is not found!');
    }
    return match;
  }

  async delete(id: string): Promise<Match> {
    console.log('Match deleted');
    return await this.matchModel.findByIdAndRemove(id);
  }
}
