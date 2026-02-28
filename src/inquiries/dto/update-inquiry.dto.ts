import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { InquiryStatus } from '../inquiry.entity.js';

export class UpdateInquiryDto {
  @ApiPropertyOptional({ enum: InquiryStatus })
  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

  @ApiPropertyOptional({ example: 'Followed up via email on 2026-03-01' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  adminNotes?: string;
}
