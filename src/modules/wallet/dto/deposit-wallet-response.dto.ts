import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from 'src/enum/transaction-status.enum';
import { Type } from 'class-transformer';

export class DepositWalletResponseDto {
  @ApiProperty({ example: 'ea0212d3-abd6-406f-8c67-868e814a2433' })
  @Type(() => String)
  id: string;

  @ApiProperty({
    example: '526ea8b2-428e-403b-b9fd-f10972e0d6fe',
    name: 'deposited_by',
  })
  @Type(() => String)
  deposited_by: string;

  @ApiProperty({ example: 'success' })
  @Type(() => String)
  status: TransactionStatus;

  @ApiProperty({ name: 'deposited_at', example: '1994-11-05T08:15:30-05:00' })
  @Type(() => Date)
  deposited_at: Date;

  @ApiProperty({ example: 60000 })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    example: 'ea0212d3-abd6-406f-8c67-868e814a2436',
    name: 'reference_id',
  })
  @Type(() => String)
  reference_id: string;
}
