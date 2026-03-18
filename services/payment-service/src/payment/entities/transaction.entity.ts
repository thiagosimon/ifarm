import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  orderId: string;

  @Column({ unique: true, nullable: true })
  @Index()
  pagarmeTransactionId: string;

  @Column()
  farmerId: string;

  @Column()
  retailerId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  commissionAmount: number;

  @Column()
  method: string; // PIX, BOLETO, CREDIT_CARD

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  pixQrCode: string;

  @Column({ nullable: true })
  pixExpiration: Date;

  @Column({ nullable: true })
  boletoUrl: string;

  @Column({ nullable: true })
  boletoBarcode: string;

  @Column({ nullable: true })
  boletoExpiration: Date;

  @Column({ nullable: true })
  lastFourDigits: string;

  @Column({ nullable: true })
  cardBrand: string;

  @Column('jsonb', { nullable: true })
  splitRules: any;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  failedAt: Date;

  @Column({ nullable: true })
  refundedAt: Date;

  @Column({ nullable: true })
  failureReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
