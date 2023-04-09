import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class InitWalletInputDto {
  @ApiProperty({
    name: 'customer_xid',
    example: 'ea0212d3-abd6-406f-8c67-868e814a2436',
  })
  @IsNotEmpty()
  @IsUUID()
  customer_xid: string;
}
