import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('commissions')
export class Commission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  orderId: string;

  @Column()
  @Index()
  retailerId: string;

  @Column()
  farmerId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  orderTotalAmount: number;

  @Column('decimal', { precision: 5, scale: 4 })
  commissionRate: number;

  @Column('decimal', { precision: 12, scale: 2 })
  commissionAmount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  netAmount: number;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  holdbackReleaseAt: Date;

  @Column({ nullable: true })
  releasedAt: Date;

  @Column({ nullable: true })
  payoutId: string;

  @Column({ nullable: true })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
