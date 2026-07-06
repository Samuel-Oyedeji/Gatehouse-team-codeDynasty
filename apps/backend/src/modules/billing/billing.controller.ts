import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { CreateBillingRunDto } from './dto/create-billing-run.dto';
import { CreateLevyDto } from './dto/create-levy.dto';
import { RenameBillingRunDto } from './dto/rename-billing-run.dto';
import { nairaToKobo } from '../../common/money';

@ApiTags('Billing')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Post('run')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a billing run (one service charge per unit)' })
  async run(@Body() dto: CreateBillingRunDto) {
    const data = await this.billing.createBillingRun(dto.estateId, {
      cycleLabel: dto.cycleLabel,
      chargeAmountKobo: nairaToKobo(dto.chargeAmountNaira),
      dueDate: dto.dueDate,
      unitIds: dto.unitIds,
    });
    return { message: 'Billing run created', data };
  }

  @Patch('run/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rename a billing run and its associated charges' })
  async renameRun(@Param('id') id: string, @Body() dto: RenameBillingRunDto) {
    await this.billing.renameBillingRun(id, dto.cycleLabel);
    return { message: 'Billing run renamed' };
  }

  @Post('levy')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a one-off levy charge per unit' })
  async levy(@Body() dto: CreateLevyDto) {
    const data = await this.billing.createLevy(dto.estateId, {
      name: dto.name,
      amountKobo: nairaToKobo(dto.amountNaira),
      dueDate: dto.dueDate,
      requireExact: dto.requireExact,
      unitIds: dto.unitIds,
    });
    return { message: 'Levy created', data };
  }
}
