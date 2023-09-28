import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchDto } from 'src/Match/dto/match.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from '../DB/match.schema';

@Injectable()
export class TourService {
  private matches: MatchDto[] = [];
  private teams: string[];
  private tourIdCounter: number = 1;

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
  addTournamentMatch(newMatch: MatchDto): MatchDto {
    // Check if a match with the same home and away teams already exists in the list
    const isDuplicateMatch = this.matches.some((match) =>
      this.isDuplicateMatch(newMatch, match),
    );

    // Check if the match is in the appropriate form (with both matches of a tour)
    if (!this.isMatchWithReverseMatch(newMatch)) {
      throw new Error('Match is not in the appropriate form.');
    }

    if (!isDuplicateMatch) {
      // If no duplicate match, generate a unique tourId for the new tour
      const newTourId = this.tourIdCounter++;

      // Add the new match to the list with the generated tourId
      const matchWithTourId: MatchDto = {
        ...newMatch,
        id: newTourId, // Use the generated tourId
      };

      this.matches.push(matchWithTourId);
      return matchWithTourId;
    } else {
      // Handle the case where a duplicate match is encountered
      throw new Error('A duplicate match already exists.');
    }
  }

  private isDuplicateMatch(
    newMatch: MatchDto,
    existingMatch: MatchDto,
  ): boolean {
    // Check if the teams and scores are the same for both matches
    return (
      (newMatch.homeTeam === existingMatch.homeTeam &&
        newMatch.awayTeam === existingMatch.awayTeam &&
        newMatch.homeScore === existingMatch.homeScore &&
        newMatch.awayScore === existingMatch.awayScore) ||
      (newMatch.homeTeam === existingMatch.awayTeam &&
        newMatch.awayTeam === existingMatch.homeTeam &&
        newMatch.homeScore === existingMatch.awayScore &&
        newMatch.awayScore === existingMatch.homeScore)
    );
  }

  private isMatchWithReverseMatch(newMatch: MatchDto): boolean {
    // Check if there's a reverse match with the same teams and scores
    return this.matches.some(
      (match) =>
        match.homeTeam === newMatch.awayTeam &&
        match.awayTeam === newMatch.homeTeam &&
        match.homeScore === newMatch.awayScore &&
        match.awayScore === newMatch.homeScore,
    );
  }

  private generateUniqueId(): number {
    // Find the highest existing ID in the list of matches
    const existingIds = this.matches.map((match) => match.id);
    const maxId = Math.max(...existingIds, 0);

    // Generate a new unique ID
    return maxId + 1;
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
    const schedule: MatchDto[] = [];
    const numTeams = teams.length;
    const numRounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;
    let tourId = 1; // Initialize tour ID

    for (let round = 1; round <= numRounds; round++) {
      const roundMatchesFirstHalf: MatchDto[] = [];
      const roundMatchesSecondHalf: MatchDto[] = [];

      for (let i = 0; i < matchesPerRound; i++) {
        const teamA = teams[i];
        const teamB = teams[numTeams - i - 1];

        if (teamA !== 'Bye' && teamB !== 'Bye' && teamA !== teamB) {
          // Generate random scores between 0 and 5 for home and away teams
          const homeScore = Math.floor(Math.random() * 6); // 0 to 5
          const awayScore = Math.floor(Math.random() * 6); // 0 to 5

          // Create two matches with the same tourId
          roundMatchesFirstHalf.push({
            id: tourId,
            homeTeam: teamA,
            awayTeam: teamB,
            homeScore,
            awayScore,
          });

          roundMatchesFirstHalf.push({
            id: tourId,
            homeTeam: teamB,
            awayTeam: teamA,
            homeScore,
            awayScore,
          });

          roundMatchesSecondHalf.push({
            id: tourId + 1, // Increment the id for the second half
            homeTeam: teamA,
            awayTeam: teamB,
            homeScore,
            awayScore,
          });

          roundMatchesSecondHalf.push({
            id: tourId + 1, // Increment the id for the second half
            homeTeam: teamB,
            awayTeam: teamA,
            homeScore,
            awayScore,
          });

          // Increment the tour ID for the next round
          tourId += 2;
        }
      }

      schedule.push(...roundMatchesFirstHalf);
      schedule.push(...roundMatchesSecondHalf);
    }

    this.matches = [...schedule];
  }

  getTourById(id: number): MatchDto[] | null {
    // Filter matches to get the matches for the specified tour ID
    const tourMatches = this.matches.filter((match) => match.id === id);

    if (tourMatches.length === 0) {
      return null; // Tour not found
    }

    return tourMatches;
  }

  getSchedule(): MatchDto[] {
    return this.matches;
  }
  deleteMatchById(matchId: number): void {
    const index = this.matches.findIndex((match) => match.id === matchId);

    if (index !== -1) {
      this.matches.splice(index, 1);
    } else {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }
  }
}
