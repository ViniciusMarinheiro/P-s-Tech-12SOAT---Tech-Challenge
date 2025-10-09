import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRejectStatus1759965714868 implements MigrationInterface {
    name = 'AddRejectStatus1759965714868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" ALTER COLUMN "protocol" DROP DEFAULT`);
        await queryRunner.query(`ALTER TYPE "public"."work_orders_status_enum" RENAME TO "work_orders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."work_orders_status_enum" AS ENUM('RECEIVED', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_PROGRESS', 'FINISHED', 'DELIVERED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "work_orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "work_orders" ALTER COLUMN "status" TYPE "public"."work_orders_status_enum" USING "status"::"text"::"public"."work_orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "work_orders" ALTER COLUMN "status" SET DEFAULT 'RECEIVED'`);
        await queryRunner.query(`DROP TYPE "public"."work_orders_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."work_orders_status_enum_old" AS ENUM('RECEIVED', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_PROGRESS', 'FINISHED', 'DELIVERED')`);
        await queryRunner.query(`ALTER TABLE "work_orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "work_orders" ALTER COLUMN "status" TYPE "public"."work_orders_status_enum_old" USING "status"::"text"::"public"."work_orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "work_orders" ALTER COLUMN "status" SET DEFAULT 'RECEIVED'`);
        await queryRunner.query(`DROP TYPE "public"."work_orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."work_orders_status_enum_old" RENAME TO "work_orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "work_orders" ALTER COLUMN "protocol" SET DEFAULT ''`);
    }

}
