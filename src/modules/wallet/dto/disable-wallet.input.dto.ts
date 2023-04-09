import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class DisableWalletInputDto {
  @ApiProperty({
    name: 'is_disabled',
    example: 'true',
  })
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  is_disabled: boolean;
}
