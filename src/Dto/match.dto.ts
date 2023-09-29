import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MatchDto {
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly homeTeam: string;

  @IsNotEmpty()
  @IsString()
  readonly awayTeam: string;

  @IsNotEmpty()
  @IsNumber()
  readonly homeScore: number;

  @IsNotEmpty()
  @IsNumber()
  readonly awayScore: number;
}
