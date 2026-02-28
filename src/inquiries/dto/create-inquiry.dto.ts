import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SiteOrigin } from '../inquiry.entity.js';

export class CreateInquiryDto {
  @ApiProperty({
    enum: SiteOrigin,
    example: SiteOrigin.PROMO,
    description: 'Which website the inquiry originates from',
  })
  @IsEnum(SiteOrigin)
  siteOrigin!: SiteOrigin;

  @ApiProperty({ example: '山田太郎' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'yamada@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '090-1234-5678' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: '株式会社サンプル' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @ApiProperty({ example: 'サービスについての質問' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  subject!: string;

  @ApiProperty({ example: 'AIチャットボットの導入費用を教えてください。' })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  message!: string;
}
