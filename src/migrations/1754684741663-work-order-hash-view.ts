import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkOrderHashView1754684741663 implements MigrationInterface {
    name = 'WorkOrderHashView1754684741663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "hash_view" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "hash_view"`);
    }

}
