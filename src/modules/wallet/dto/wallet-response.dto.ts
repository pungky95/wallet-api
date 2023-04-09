import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WalletStatus } from 'src/enum/wallet-status';

export class WalletResponseDto {
  @ApiProperty({
    name: 'id',
    example: '6ef31ed3-f396-4b6c-8049-674ddede1b16',
  })
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'owned_by',
    example: '6ef31ed3-f396-4b6c-8049-674ddede1b16',
  })
  @Type(() => String)
  owned_by: string;

  @ApiProperty({
    name: 'status',
    example: 'enabled',
  })
  @Type(() => String)
  status: WalletStatus;

  @ApiProperty({
    name: 'enabled_at',
    example: '1994-11-05T08:15:30-05:00',
  })
  @Type(() => Date)
  enabled_at: Date;

  @ApiProperty({
    name: 'balance',
    example: 10000,
  })
  @Type(() => Number)
  balance: number;
}
