import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RenameBillingRunDto {
  @ApiProperty({ example: 'March 2026 Service Charge' })
  @IsString()
  @MinLength(1)
  cycleLabel: string;
}
