import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InquiryStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum SiteOrigin {
  PROMO = 'promo',
  BLOG_CALCULATOR = 'blog-calculator',
  BLOG_MATH = 'blog-math',
  OTHER = 'other',
}

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: SiteOrigin,
    default: SiteOrigin.OTHER,
    name: 'site_origin',
  })
  siteOrigin!: SiteOrigin;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  company!: string | null;

  @Column({ length: 255 })
  subject!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({
    type: 'enum',
    enum: InquiryStatus,
    default: InquiryStatus.NEW,
  })
  status!: InquiryStatus;

  @Column({ type: 'text', nullable: true, name: 'admin_notes' })
  adminNotes!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'ip_address', length: 45 })
  ipAddress!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
