import { MigrationInterface, QueryRunner } from 'typeorm';

export class FiscalEvaluationIndexes1711131072177 implements MigrationInterface {
  name = 'FiscalEvaluationIndexes1711131072177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_0e7ee38f8fd593e92b580b548c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b9971cfcbe9942c6143859f5b2"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6e83e6240639957159d530bd07" ON "building_fiscal" ("building_id", "fiscal_key_id", "fiscal_year") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_090eb947e3bbea372f062ef177" ON "building_evaluation" ("building_id", "evaluation_key_id", "year") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ade0e22c63621acca45c8c01e9" ON "parcel_fiscal" ("parcel_id", "fiscal_key_id", "fiscal_year") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b9971cfcbe9942c6143859f5b2" ON "parcel_evaluation" ("parcel_id", "evaluation_key_id", "year") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_b9971cfcbe9942c6143859f5b2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ade0e22c63621acca45c8c01e9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_090eb947e3bbea372f062ef177"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6e83e6240639957159d530bd07"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_b9971cfcbe9942c6143859f5b2" ON "parcel_evaluation" ("evaluation_key_id", "parcel_id", "year") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e7ee38f8fd593e92b580b548c" ON "building_evaluation" ("evaluation_key_id", "building_id") `,
    );
  }
}
