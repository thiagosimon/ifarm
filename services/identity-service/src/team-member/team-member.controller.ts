import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Controller('v1/team-members')
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTeamMemberDto) {
    const member = await this.teamMemberService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Team member created successfully',
      data: member,
    };
  }

  @Get()
  async findAll(@Query('retailerId') retailerId?: string) {
    const members = await this.teamMemberService.findAll(retailerId);
    return {
      statusCode: HttpStatus.OK,
      data: members,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const member = await this.teamMemberService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data: member,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    const member = await this.teamMemberService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team member updated successfully',
      data: member,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.teamMemberService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team member deleted successfully',
    };
  }
}
