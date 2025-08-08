import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkOrderUser1754654428867 implements MigrationInterface {
    name = 'WorkOrderUser1754654428867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD CONSTRAINT "FK_c3013397350780ff9a3ba587f91" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" DROP CONSTRAINT "FK_c3013397350780ff9a3ba587f91"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "user_id"`);
    }

}
