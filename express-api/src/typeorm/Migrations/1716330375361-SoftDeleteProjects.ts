import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftDeleteProjects1716330375361 implements MigrationInterface {
  name = 'SoftDeleteProjects1716330375361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project_property" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_property" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "project_task" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_task" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "project_status_history" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_status_history" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "project_note" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_note" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "project_agency_response" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_agency_response" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "project" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(
      `CREATE INDEX "IDX_442b7a17c416ffba799aee942c" ON "project_property" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db57120403a2995d7a81b0ea47" ON "project_task" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_929a243b8d5910df60770e49b7" ON "project_status_history" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87d5b2c320dc038878adbb076d" ON "project_note" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d412dc9a4eb5047cde9f40da2b" ON "project_agency_response" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_630c1b0538706556482df8f78f" ON "project" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55b09a1ddec71ad1563f6f3022" ON "project_snapshot" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_442b7a17c416ffba799aee942cb" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_db57120403a2995d7a81b0ea479" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_929a243b8d5910df60770e49b71" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_87d5b2c320dc038878adbb076d7" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_d412dc9a4eb5047cde9f40da2bc" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_630c1b0538706556482df8f78fa" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_55b09a1ddec71ad1563f6f3022d" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_55b09a1ddec71ad1563f6f3022d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_630c1b0538706556482df8f78fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_d412dc9a4eb5047cde9f40da2bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_87d5b2c320dc038878adbb076d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_929a243b8d5910df60770e49b71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_db57120403a2995d7a81b0ea479"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_442b7a17c416ffba799aee942cb"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_55b09a1ddec71ad1563f6f3022"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_630c1b0538706556482df8f78f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d412dc9a4eb5047cde9f40da2b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_87d5b2c320dc038878adbb076d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_929a243b8d5910df60770e49b7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_db57120403a2995d7a81b0ea47"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_442b7a17c416ffba799aee942c"`);
    await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "project_agency_response" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "project_agency_response" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "project_note" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "project_note" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "project_status_history" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "project_status_history" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "project_task" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "project_task" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "project_property" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "project_property" DROP COLUMN "deleted_by_id"`);
  }
}
