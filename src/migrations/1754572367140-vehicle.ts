import { MigrationInterface, QueryRunner } from "typeorm";

export class Vehicle1754572367140 implements MigrationInterface {
    name = 'Vehicle1754572367140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vehicles" ALTER COLUMN "brand" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicles" ALTER COLUMN "model" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicles" ALTER COLUMN "year" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" ALTER COLUMN "year" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicles" ALTER COLUMN "model" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicles" ALTER COLUMN "brand" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "updated_at"`);
    }

}
