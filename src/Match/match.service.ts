import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from '../DB/match.schema';
import { TeamStatsDto } from './dto/team-stats.dto';

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

  async createAggregation(): Promise<TeamStatsDto[]> {
    const teamStatistics: TeamStatsDto[] = await this.matchModel.aggregate([
      {
        $facet: {
          homeMatches: [
            {
              $match: {
                homeTeam: { $exists: true },
              },
            },
            {
              $project: {
                team: { $toLower: '$homeTeam' }, // Convert to lowercase
                result: {
                  $cond: [
                    { $eq: ['$homeScore', '$awayScore'] },
                    'draw',
                    {
                      $cond: [
                        { $gt: ['$homeScore', '$awayScore'] },
                        'win',
                        'lose',
                      ],
                    },
                  ],
                },
                missedGoals: '$awayScore',
                scoredGoals: '$homeScore',
              },
            },
          ],
          awayMatches: [
            {
              $match: {
                awayTeam: { $exists: true },
              },
            },
            {
              $project: {
                team: { $toLower: '$awayTeam' }, // Convert to lowercase
                result: {
                  $cond: [
                    { $eq: ['$homeScore', '$awayScore'] },
                    'draw',
                    {
                      $cond: [
                        { $gt: ['$awayScore', '$homeScore'] },
                        'win',
                        'lose',
                      ],
                    },
                  ],
                },
                missedGoals: '$homeScore',
                scoredGoals: '$awayScore',
              },
            },
          ],
        },
      },
      {
        $project: {
          allMatches: { $concatArrays: ['$homeMatches', '$awayMatches'] },
        },
      },
      {
        $unwind: '$allMatches',
      },
      {
        $group: {
          _id: '$allMatches.team',
          won: {
            $sum: { $cond: [{ $eq: ['$allMatches.result', 'win'] }, 1, 0] },
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$allMatches.result', 'lose'] }, 1, 0] },
          },
          drawn: {
            $sum: { $cond: [{ $eq: ['$allMatches.result', 'draw'] }, 1, 0] },
          },
          missedGoals: { $sum: '$allMatches.missedGoals' },
          scoredGoals: { $sum: '$allMatches.scoredGoals' },
          score: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ['$allMatches.result', 'win'] }, then: 3 },
                  { case: { $eq: ['$allMatches.result', 'draw'] }, then: 1 },
                  { case: { $eq: ['$allMatches.result', 'lose'] }, then: 0 },
                ],
                default: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          team: '$_id',
          won: 1,
          lost: 1,
          drawn: 1,
          missedGoals: 1,
          scoredGoals: 1,
          score: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          score: -1, // Sort in descending order (highest score first)
        },
      },
    ]);

    return teamStatistics;
  }
}
