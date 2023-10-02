import { Injectable } from '@nestjs/common';
import { MatchDto } from 'src/Dto/match.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from '../Database/match.schema';

@Injectable()
export class TourService {
  private matches: MatchDto[] = [];
  private teams: string[];

  constructor(
    @InjectModel(Match.name)
    private readonly matchModel: Model<Match>,
  ) {
    this.initializeSchedule();
  }
  private async initializeSchedule() {
    this.teams = await this.getTeamNames();
    this.generateSchedule(this.teams);
  }

  public getMatchesByTeam(teamName: string): MatchDto[] {
    if (!this.teams.includes(teamName)) {
      throw new Error(`Team ${teamName} not found.`);
    }

    return this.matches.filter(
      (match) => match.homeTeam === teamName || match.awayTeam === teamName,
    );
  }

  async addTour(tour: MatchDto[]): Promise<string> {
    if (this.matches.length === 12) {
      return 'You cannot add more tours into tournament!';
    }

    // Check if the request is in appropriate form
    if (
      tour.length !== 2 ||
      !tour.every(
        (match) =>
          'homeTeam' in match &&
          'awayTeam' in match &&
          'homeScore' in match &&
          'awayScore' in match,
      )
    ) {
      return 'Request is not in appropriate form';
    }

    // Check whether this tour with exact matches is already in matches array
    const tourExists = this.matches.some((match, index) => {
      return (
        index % 2 === 0 && // Check every pair of matches
        this.matches[index].homeTeam === tour[0].homeTeam &&
        this.matches[index].awayTeam === tour[0].awayTeam &&
        this.matches[index + 1].homeTeam === tour[1].homeTeam &&
        this.matches[index + 1].awayTeam === tour[1].awayTeam
      );
    });

    if (tourExists) {
      return 'This tour already exists';
    }

    // If the tour doesn't exist and the request is in appropriate form, add the tour
    const tourId = Math.floor(this.matches.length / 2) + 1; // Calculate the next id

    const newTour = tour.map((match, index) => ({
      matchId: this.matches.length + index + 1,
      tourId,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    })); // Assign the id to each match and only include required fields

    this.matches.push(...newTour);

    return 'Tour added successfully';
  }

  async getTeamNames(): Promise<string[]> {
    const distinctHomeTeams = await this.matchModel.distinct('homeTeam').exec();
    const distinctAwayTeams = await this.matchModel.distinct('awayTeam').exec();

    // Merge and deduplicate the home and away team names
    const allTeams = [...distinctHomeTeams, ...distinctAwayTeams];
    const uniqueTeams = Array.from(new Set(allTeams));

    return uniqueTeams;
  }

  private generateSchedule(teams: string[]): void {
    const scheduleFirstHalf: MatchDto[] = [];
    const scheduleSecondHalf: MatchDto[] = [];

    if (teams.length % 2 !== 0) {
      teams.push('Bye');
    }

    const numTeams = teams.length;
    const numRounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;

    const fixedTeamOrder = [...teams];

    for (let round = 1; round <= numRounds; round++) {
      const roundMatchesFirstHalf: MatchDto[] = [];
      const roundMatchesSecondHalf: MatchDto[] = [];

      for (let i = 0; i < matchesPerRound; i++) {
        const teamA = fixedTeamOrder[i];
        const teamB = fixedTeamOrder[numTeams - i - 1];

        if (teamA !== 'Bye' && teamB !== 'Bye' && teamA !== teamB) {
          const homeScore = Math.floor(Math.random() * 6);
          const awayScore = Math.floor(Math.random() * 6);

          roundMatchesFirstHalf.push({
            matchId: 0,
            tourId: 0,
            homeTeam: teamA,
            awayTeam: teamB,
            homeScore,
            awayScore,
          });

          roundMatchesSecondHalf.push({
            matchId: 0,
            tourId: 0,
            homeTeam: teamB,
            awayTeam: teamA,
            homeScore,
            awayScore,
          });
        }
      }

      scheduleFirstHalf.push(...roundMatchesFirstHalf);
      scheduleSecondHalf.push(...roundMatchesSecondHalf);

      fixedTeamOrder.splice(1, 0, fixedTeamOrder.pop());
    }

    this.matches = [...scheduleFirstHalf, ...scheduleSecondHalf].map(
      (match, index) => {
        const matchIndx = index + 1;
        return {
          ...match,
          tourId: Math.floor(index / 2) + 1,
          matchId: matchIndx,
        };
      },
    );
  }

  getTourById(id: number): MatchDto[] | null {
    // Filter matches to get the matches for the specified tour ID
    const tourMatches = this.matches.filter((match) => match.tourId === id);

    if (tourMatches.length === 0) {
      return null; // Tour not found
    }

    return tourMatches;
  }

  async updateScoresById(
    matchId: number,
    homeScore: number,
    awayScore: number,
  ): Promise<MatchDto | string> {
    if (matchId === -1 || matchId > 12) {
      return 'Match with the provided id not found';
    }

    // Update the scores for both home and away teams
    this.matches[matchId].homeScore = homeScore;
    this.matches[matchId].awayScore = awayScore;

    return this.matches[matchId];
  }

  getSchedule(): MatchDto[] {
    return this.matches;
  }
  async deleteTour(id: number): Promise<string> {
    const initialLength = this.matches.length;
    this.matches = this.matches.filter((match) => match.tourId !== id);

    if (this.matches.length === initialLength) {
      return 'No tour with this id exists';
    } else {
      return 'Tour deleted successfully';
    }
  }
}
