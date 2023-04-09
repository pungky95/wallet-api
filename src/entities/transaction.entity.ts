import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
  BeforeUpdate,
} from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TransactionStatus } from '../enum/transaction-status.enum';
import { TransactionType } from '../enum/transaction-type.enum';
import { Wallet } from './wallet.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'wallet_id' })
  @Exclude()
  wallet: Wallet;

  @Column({ name: 'wallet_id', type: 'uuid', nullable: false })
  @Exclude()
  public walletId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @ApiProperty({ name: 'transacted_at', example: '2021-01-01 00:00:00' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'reference_id', type: 'uuid', nullable: false })
  referenceId: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  @Exclude()
  deletedAt?: Date;

  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  rounding?() {
    this.amount = this.amount ? Math.round(this.amount) : this.amount;
  }
}
