import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TransactionStatus } from 'src/enum/transaction-status.enum';
import { TransactionType } from 'src/enum/transaction-type.enum';

export class TransactionResponseDto {
  @ApiProperty({
    name: 'id',
    example: '6ef31ed3-f396-4b6c-8049-674ddede1b16',
  })
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'status',
    example: 'enabled',
  })
  @Type(() => String)
  status: TransactionStatus;

  @ApiProperty({
    name: 'transacted_at',
    example: '1994-11-05T08:15:30-05:00',
  })
  @Type(() => Date)
  transacted_at: Date;

  @ApiProperty({
    name: 'type',
    example: 'enabled',
  })
  @Type(() => String)
  type: TransactionType;

  @ApiProperty({
    name: 'amount',
    example: 10000,
  })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    name: 'reference_id',
    example: '6ef31ed3-f396-4b6c-8049-674ddede1b16',
  })
  @Type(() => String)
  reference_id: string;
}
