import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry, SiteOrigin } from './inquiry.entity.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly repo: Repository<Inquiry>,
  ) {}

  async create(dto: CreateInquiryDto, ipAddress?: string): Promise<Inquiry> {
    const inquiry = this.repo.create({
      ...dto,
      ipAddress: ipAddress ?? null,
    });
    return this.repo.save(inquiry);
  }

  async findAll(filters?: {
    siteOrigin?: SiteOrigin;
    status?: string;
  }): Promise<Inquiry[]> {
    const qb = this.repo.createQueryBuilder('inquiry');

    if (filters?.siteOrigin) {
      qb.andWhere('inquiry.site_origin = :site', {
        site: filters.siteOrigin,
      });
    }

    if (filters?.status) {
      qb.andWhere('inquiry.status = :status', { status: filters.status });
    }

    qb.orderBy('inquiry.created_at', 'DESC');
    return qb.getMany();
  }

  async findOne(id: string): Promise<Inquiry> {
    const inquiry = await this.repo.findOne({ where: { id } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async update(id: string, dto: UpdateInquiryDto): Promise<Inquiry> {
    const inquiry = await this.findOne(id);
    Object.assign(inquiry, dto);
    return this.repo.save(inquiry);
  }

  async remove(id: string): Promise<void> {
    const inquiry = await this.findOne(id);
    await this.repo.remove(inquiry);
  }
}
