import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TeamMemberRole, TeamMemberStatus } from '../schemas/team-member.schema';

export class CreateTeamMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(TeamMemberRole)
  role: TeamMemberRole;

  @IsOptional()
  @IsEnum(TeamMemberStatus)
  status?: TeamMemberStatus;

  @IsOptional()
  @IsString()
  keycloakId?: string;

  @IsOptional()
  @IsString()
  retailerId?: string;
}
