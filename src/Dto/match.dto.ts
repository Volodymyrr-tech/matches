import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MatchDto {
  readonly matchId: number;
  readonly tourId: number;

  @IsNotEmpty()
  @IsString()
  readonly homeTeam: string;

  @IsNotEmpty()
  @IsString()
  readonly awayTeam: string;

  @IsNotEmpty()
  @IsNumber()
  homeScore: number;

  @IsNotEmpty()
  @IsNumber()
  awayScore: number;
}
