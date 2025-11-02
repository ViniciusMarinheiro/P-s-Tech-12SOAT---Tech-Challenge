import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProtocolToWorkOrders1755000000000
  implements MigrationInterface
{
  name = 'AddProtocolToWorkOrders1755000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_orders" ADD "protocol" character varying NOT NULL DEFAULT ''`,
    )

    const workOrders = await queryRunner.query(
      `SELECT id FROM "work_orders" ORDER BY id`,
    )

    for (const workOrder of workOrders) {
      const currentYear = new Date().getFullYear()
      const paddedId = workOrder.id.toString().padStart(5, '0')
      const protocol = `OS-${currentYear}-${paddedId}`

      await queryRunner.query(
        `UPDATE "work_orders" SET "protocol" = $1 WHERE "id" = $2`,
        [protocol, workOrder.id],
      )
    }

    await queryRunner.query(
      `ALTER TABLE "work_orders" ADD CONSTRAINT "UQ_work_orders_protocol" UNIQUE ("protocol")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_orders" DROP CONSTRAINT "UQ_work_orders_protocol"`,
    )
    await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "protocol"`)
  }
}
