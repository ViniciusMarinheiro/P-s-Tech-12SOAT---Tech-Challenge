import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1754427172663 implements MigrationInterface {
    name = 'Initial1754427172663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "document_number" character varying(20) NOT NULL, "phone" character varying(20), "email" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22b98dcb177bd6261887c8c9593" UNIQUE ("document_number"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "plate" character varying(10) NOT NULL, "brand" character varying(50), "model" character varying(50), "year" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE ("plate"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parts" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "stock" integer NOT NULL DEFAULT '0', "unit_price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_daa5595bb8933f49ac00c9ebc79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_orders" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "vehicle_id" integer NOT NULL, "status" "public"."work_orders_status_enum" NOT NULL DEFAULT 'RECEIVED', "total_amount" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_29f6c1884082ee6f535aed93660" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_order_services" ("id" SERIAL NOT NULL, "work_order_id" integer NOT NULL, "service_id" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "total_price" integer NOT NULL, CONSTRAINT "PK_67cc6db8cc36862baf74fbfa2b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_order_parts" ("id" SERIAL NOT NULL, "work_order_id" integer NOT NULL, "part_id" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "total_price" integer NOT NULL, CONSTRAINT "PK_f940468276c041deed13cd240cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_c1cda98f67cb9c79a1f1153e627" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD CONSTRAINT "FK_a9cd45a23c6212aaa1737d69163" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD CONSTRAINT "FK_18fb19db181c9e178cc8e5b6c8f" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_order_services" ADD CONSTRAINT "FK_f1e89a9b35b96435fbdc07670bb" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_order_services" ADD CONSTRAINT "FK_528ca0a8131271b124ff0c49581" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" ADD CONSTRAINT "FK_f0cd99de92dd30d18f97bf3e51b" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" ADD CONSTRAINT "FK_755e76456ba17545dc3f9b44f80" FOREIGN KEY ("part_id") REFERENCES "parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_order_parts" DROP CONSTRAINT "FK_755e76456ba17545dc3f9b44f80"`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" DROP CONSTRAINT "FK_f0cd99de92dd30d18f97bf3e51b"`);
        await queryRunner.query(`ALTER TABLE "work_order_services" DROP CONSTRAINT "FK_528ca0a8131271b124ff0c49581"`);
        await queryRunner.query(`ALTER TABLE "work_order_services" DROP CONSTRAINT "FK_f1e89a9b35b96435fbdc07670bb"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP CONSTRAINT "FK_18fb19db181c9e178cc8e5b6c8f"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP CONSTRAINT "FK_a9cd45a23c6212aaa1737d69163"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_c1cda98f67cb9c79a1f1153e627"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "work_order_parts"`);
        await queryRunner.query(`DROP TABLE "work_order_services"`);
        await queryRunner.query(`DROP TABLE "work_orders"`);
        await queryRunner.query(`DROP TABLE "parts"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
