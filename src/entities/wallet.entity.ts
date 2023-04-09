import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { WalletStatus } from '../enum/wallet-status';
import { Transaction } from './transaction.entity';
import { OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    name: 'owned_by',
    example: '6ef31975-67b0-421a-9493-667569d89556',
  })
  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: WalletStatus,
    default: WalletStatus.ENABLED,
  })
  status: WalletStatus;

  @Column({ name: 'enabled_at', type: 'timestamp', nullable: false })
  enabledAt: Date;

  @Column({ name: 'balance', type: 'decimal', precision: 14, scale: 2 })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  @Exclude()
  transactions: Transaction[];

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt: Date;

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
    this.balance = this.balance ? Math.round(this.balance) : this.balance;
  }
}
