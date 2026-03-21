import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamMemberRole, TeamMemberStatus } from '../schemas/team-member.schema';

export class UpdateTeamMemberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(TeamMemberRole)
  role?: TeamMemberRole;

  @IsOptional()
  @IsEnum(TeamMemberStatus)
  status?: TeamMemberStatus;

  @IsOptional()
  @IsString()
  keycloakId?: string;
}
