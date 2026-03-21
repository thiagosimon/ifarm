import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamMemberDocument = TeamMember & Document;

export enum TeamMemberRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, enum: TeamMemberRole, default: TeamMemberRole.VIEWER })
  role: TeamMemberRole;

  @Prop({ enum: TeamMemberStatus, default: TeamMemberStatus.ACTIVE })
  status: TeamMemberStatus;

  @Prop({ type: String, default: null })
  keycloakId: string | null;

  @Prop({ type: String, default: null })
  retailerId: string | null;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
