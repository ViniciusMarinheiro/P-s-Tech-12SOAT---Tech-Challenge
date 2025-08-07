import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerEmailUnique1754569622173 implements MigrationInterface {
    name = 'CustomerEmailUnique1754569622173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174"`);
    }

}
