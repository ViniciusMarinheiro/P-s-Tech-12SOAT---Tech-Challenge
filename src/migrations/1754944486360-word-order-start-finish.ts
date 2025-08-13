import { MigrationInterface, QueryRunner } from "typeorm";

export class WordOrderStartFinish1754944486360 implements MigrationInterface {
    name = 'WordOrderStartFinish1754944486360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "started_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "finished_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "finished_at"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "started_at"`);
    }

}
