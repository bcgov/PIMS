import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueProjectProperties1712855603006 implements MigrationInterface {
  name = 'UniqueProjectProperties1712855603006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_ef992ea03a65f72e0b69644b35"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ef992ea03a65f72e0b69644b35" ON "project_property" ("project_id", "property_type_id", "parcel_id", "building_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_ef992ea03a65f72e0b69644b35"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_ef992ea03a65f72e0b69644b35" ON "project_property" ("project_id", "property_type_id", "parcel_id", "building_id") `,
    );
  }
}
