import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamMember, TeamMemberDocument } from './schemas/team-member.schema';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamMemberService {
  private readonly logger = new Logger(TeamMemberService.name);

  constructor(
    @InjectModel(TeamMember.name)
    private readonly teamMemberModel: Model<TeamMemberDocument>,
  ) {}

  async create(dto: CreateTeamMemberDto): Promise<TeamMemberDocument> {
    const existing = await this.teamMemberModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (existing) {
      throw new ConflictException('A team member with this email already exists');
    }

    const member = new this.teamMemberModel({
      ...dto,
      email: dto.email.toLowerCase(),
    });

    const saved = await member.save();
    this.logger.log(`Team member created: ${saved._id}`);
    return saved;
  }

  async findAll(retailerId?: string): Promise<TeamMemberDocument[]> {
    const query = retailerId ? { retailerId } : {};
    return this.teamMemberModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<TeamMemberDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid team member ID format');
    }
    const member = await this.teamMemberModel.findById(id).exec();
    if (!member) {
      throw new NotFoundException(`Team member with id ${id} not found`);
    }
    return member;
  }

  async update(id: string, dto: UpdateTeamMemberDto): Promise<TeamMemberDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid team member ID format');
    }

    const updateData: Record<string, any> = { ...dto };
    if (dto.email) {
      updateData.email = dto.email.toLowerCase();
    }

    const member = await this.teamMemberModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    if (!member) {
      throw new NotFoundException(`Team member with id ${id} not found`);
    }

    this.logger.log(`Team member updated: ${id}`);
    return member;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid team member ID format');
    }

    const result = await this.teamMemberModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Team member with id ${id} not found`);
    }

    this.logger.log(`Team member deleted: ${id}`);
  }
}
