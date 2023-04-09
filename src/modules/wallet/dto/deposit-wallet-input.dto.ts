import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class DepositWalletInputDto {
  @ApiProperty({ example: 10000 })
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: 'ea0212d3-abd6-406f-8c67-868e814a2436' })
  @IsNotEmpty()
  @IsUUID()
  reference_id: string;
}
