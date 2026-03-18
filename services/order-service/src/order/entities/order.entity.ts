import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  @Index()
  quoteId: string;

  @Column({ unique: true })
  @Index()
  proposalId: string;

  @Column()
  @Index()
  farmerId: string;

  @Column()
  @Index()
  retailerId: string;

  @Column('jsonb')
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  commissionAmount: number;

  @Column({ default: 'AWAITING_PAYMENT' })
  status: string;

  @Column()
  paymentMethod: string;

  @Column({ nullable: true })
  trackingCode: string;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  disputeReason: string;

  @Column({ nullable: true })
  disputedAt: Date;

  @Column('jsonb', { default: [] })
  statusHistory: Array<{
    status: string;
    changedAt: string;
    changedBy: string;
    note?: string;
  }>;

  @Column({ nullable: true })
  pagarmeTransactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
