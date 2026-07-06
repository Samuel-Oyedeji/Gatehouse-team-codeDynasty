import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicService } from './public.service';

// No auth — tokenised resident statement (PRD §5.6).
@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('estate/:estateId')
  @ApiOperation({ summary: 'Estate-level transparency view (no auth)' })
  async estateTransparency(@Param('estateId') estateId: string) {
    const data = await this.publicService.getEstateTransparency(estateId);
    return { message: data ? 'OK' : 'Estate not found', data };
  }

  @Get(':token')
  @ApiOperation({ summary: 'Resident statement by link token (or unit id)' })
  async statement(@Param('token') token: string) {
    const data = await this.publicService.getPublicStatement(token);
    return { message: data ? 'OK' : 'Statement not found', data };
  }
}
