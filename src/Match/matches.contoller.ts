import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MatchService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './matches.schema';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getAllMatches(): Promise<Match[]> {
    return this.matchService.findAll();
  }

  @Get(':id')
  async getMatch(
    @Param('id')
    id: string,
  ): Promise<Match> {
    return this.matchService.findById(id);
  }

  @Post()
  async postMatchToDb(
    @Body()
    matches: CreateMatchDto[], // : Promise<Match[]>
  ) {
    console.log(matches, 'controller worked');
    return this.matchService.create(matches);
  }

  @Put(':id')
  async updateMatch(
    @Param('id')
    id: string,
    @Body()
    match: UpdateMatchDto,
  ) {
    console.log(match, 'controller worked');
    return this.matchService.updateById(id, match);
  }

  @Delete(':id')
  async deleteMatch(@Param('id') id: string): Promise<any> {
    return this.matchService.delete(id);
  }
}