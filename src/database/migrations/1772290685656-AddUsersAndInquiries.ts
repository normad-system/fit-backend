import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersAndInquiries1772290685656 implements MigrationInterface {
    name = 'AddUsersAndInquiries1772290685656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "name" character varying(50) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "refresh_token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."inquiries_site_origin_enum" AS ENUM('promo', 'blog-calculator', 'blog-math', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."inquiries_status_enum" AS ENUM('new', 'in_progress', 'resolved', 'closed')`);
        await queryRunner.query(`CREATE TABLE "inquiries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "site_origin" "public"."inquiries_site_origin_enum" NOT NULL DEFAULT 'other', "name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(50), "company" character varying(100), "subject" character varying(255) NOT NULL, "message" text NOT NULL, "status" "public"."inquiries_status_enum" NOT NULL DEFAULT 'new', "admin_notes" text, "ip_address" character varying(45), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ceacaa439988b25eb9459e694d9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "inquiries"`);
        await queryRunner.query(`DROP TYPE "public"."inquiries_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."inquiries_site_origin_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
