import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImportResultTable1719518407493 implements MigrationInterface {
  name = 'CreateImportResultTable1719518407493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "import_result" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP DEFAULT now(), "deleted_by_id" uuid, "deleted_on" TIMESTAMP, "id" SERIAL NOT NULL, "file_name" character varying(150) NOT NULL, "completion_percentage" double precision NOT NULL, "results" jsonb, CONSTRAINT "PK_a1e3bac3abf491998be3de922ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cefeb78739fcfdfa3004358bf6" ON "import_result" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_592428fdbb9d21f416df51d76e" ON "import_result" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1bd78dfd045e29e7a72294348b" ON "import_result" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "import_result" ADD CONSTRAINT "FK_cefeb78739fcfdfa3004358bf69" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "import_result" ADD CONSTRAINT "FK_592428fdbb9d21f416df51d76ef" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "import_result" ADD CONSTRAINT "FK_1bd78dfd045e29e7a72294348b2" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "import_result" DROP CONSTRAINT "FK_1bd78dfd045e29e7a72294348b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "import_result" DROP CONSTRAINT "FK_592428fdbb9d21f416df51d76ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "import_result" DROP CONSTRAINT "FK_cefeb78739fcfdfa3004358bf69"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_1bd78dfd045e29e7a72294348b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_592428fdbb9d21f416df51d76e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cefeb78739fcfdfa3004358bf6"`);
    await queryRunner.query(`DROP TABLE "import_result"`);
  }
}
