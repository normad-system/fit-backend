import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { InquiriesService } from './inquiries.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SiteOrigin } from './inquiry.entity.js';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  // ────── Public: anyone can submit an inquiry ──────

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Submit a new inquiry (public)' })
  @ApiResponse({ status: 201, description: 'Inquiry created' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async create(@Body() dto: CreateInquiryDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip;
    return this.inquiriesService.create(dto, ip);
  }

  // ────── Protected: admin endpoints ──────

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all inquiries (auth required)' })
  @ApiQuery({ name: 'site', enum: SiteOrigin, required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('site') siteOrigin?: SiteOrigin,
    @Query('status') status?: string,
  ) {
    return this.inquiriesService.findAll({ siteOrigin, status });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry detail (auth required)' })
  @ApiResponse({ status: 200, description: 'Inquiry found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry status/notes (auth required)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInquiryDto,
  ) {
    return this.inquiriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an inquiry (auth required)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.inquiriesService.remove(id);
  }
}
