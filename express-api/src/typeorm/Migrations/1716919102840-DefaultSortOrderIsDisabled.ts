import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultSortOrderIsDisabled1716919102840 implements MigrationInterface {
  name = 'DefaultSortOrderIsDisabled1716919102840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "building_evaluation" DROP COLUMN "Date"`);
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" DROP COLUMN "date"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fc733694343c53375cd9457b88"`);
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_81ede2167f3239ec87e479fb70"`);
    await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "is_disabled" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "sort_order" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_disabled" SET DEFAULT false`);
    await queryRunner.query(`DROP INDEX "public"."IDX_648ccf166d25060756fd37857a"`);
    await queryRunner.query(`ALTER TABLE "agency" ALTER COLUMN "is_disabled" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "agency" ALTER COLUMN "sort_order" SET DEFAULT '0'`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c7b46664f7177866ddcc55dd0a"`);
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_452a90da034d3278581a826fe8"`);
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_366080f87ea828610afb0e1187"`);
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_90fc9924f1694d2c295e12930c"`);
    await queryRunner.query(
      `ALTER TABLE "property_classification" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_01d56109ac04623016986a6817"`);
    await queryRunner.query(
      `ALTER TABLE "property_type" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_a8a6fd9f58d45d3dbafdd15df7"`);
    await queryRunner.query(
      `ALTER TABLE "project_status" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_21a97bacb8d918364bfa10fb51"`);
    await queryRunner.query(`ALTER TABLE "workflow" ALTER COLUMN "is_disabled" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "workflow" ALTER COLUMN "sort_order" SET DEFAULT '0'`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f85ac9b25814234deabdb943ea"`);
    await queryRunner.query(
      `ALTER TABLE "tier_level" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "tier_level" ALTER COLUMN "sort_order" SET DEFAULT '0'`);
    await queryRunner.query(`DROP INDEX "public"."IDX_138e9747c308d68098b566c694"`);
    await queryRunner.query(
      `ALTER TABLE "project_risk" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "project_risk" ALTER COLUMN "sort_order" SET DEFAULT '0'`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a1a5a88a8fb4465f95934e6963"`);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "is_disabled" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "sort_order" SET DEFAULT '0'`);
    await queryRunner.query(`DROP INDEX "public"."IDX_57f0e8e414beb3cf529299baac"`);
    await queryRunner.query(
      `ALTER TABLE "notification_template" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_14f5de982c6b5936636e891b34"`);
    await queryRunner.query(
      `ALTER TABLE "report_type" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "report_type" ALTER COLUMN "sort_order" SET DEFAULT '0'`);
    await queryRunner.query(`DROP INDEX "public"."IDX_830992b7a8654c0a800c21b00f"`);
    await queryRunner.query(
      `ALTER TABLE "project_type" ALTER COLUMN "is_disabled" SET DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "project_type" ALTER COLUMN "sort_order" SET DEFAULT '0'`);
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc733694343c53375cd9457b88" ON "administrative_area" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_81ede2167f3239ec87e479fb70" ON "role" ("is_disabled", "name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_648ccf166d25060756fd37857a" ON "agency" ("parent_id", "is_disabled", "id", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7b46664f7177866ddcc55dd0a" ON "building_construction_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_452a90da034d3278581a826fe8" ON "building_occupant_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_366080f87ea828610afb0e1187" ON "building_predominate_use" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90fc9924f1694d2c295e12930c" ON "property_classification" ("is_disabled", "name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_01d56109ac04623016986a6817" ON "property_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a8a6fd9f58d45d3dbafdd15df7" ON "project_status" ("is_disabled", "name", "code", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_21a97bacb8d918364bfa10fb51" ON "workflow" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f85ac9b25814234deabdb943ea" ON "tier_level" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_138e9747c308d68098b566c694" ON "project_risk" ("is_disabled", "code", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a1a5a88a8fb4465f95934e6963" ON "task" ("is_disabled", "is_optional", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57f0e8e414beb3cf529299baac" ON "notification_template" ("is_disabled", "tag") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14f5de982c6b5936636e891b34" ON "report_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_830992b7a8654c0a800c21b00f" ON "project_type" ("is_disabled", "name", "sort_order") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_830992b7a8654c0a800c21b00f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_14f5de982c6b5936636e891b34"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_57f0e8e414beb3cf529299baac"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a1a5a88a8fb4465f95934e6963"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_138e9747c308d68098b566c694"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f85ac9b25814234deabdb943ea"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_21a97bacb8d918364bfa10fb51"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a8a6fd9f58d45d3dbafdd15df7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_01d56109ac04623016986a6817"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_90fc9924f1694d2c295e12930c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_366080f87ea828610afb0e1187"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_452a90da034d3278581a826fe8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c7b46664f7177866ddcc55dd0a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_648ccf166d25060756fd37857a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_81ede2167f3239ec87e479fb70"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fc733694343c53375cd9457b88"`);
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ALTER COLUMN "sort_order" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "project_type" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "project_type" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_830992b7a8654c0a800c21b00f" ON "project_type" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(`ALTER TABLE "report_type" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "report_type" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_14f5de982c6b5936636e891b34" ON "report_type" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" ALTER COLUMN "is_disabled" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57f0e8e414beb3cf529299baac" ON "notification_template" ("is_disabled", "tag") `,
    );
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_a1a5a88a8fb4465f95934e6963" ON "task" ("name", "is_disabled", "sort_order", "is_optional") `,
    );
    await queryRunner.query(`ALTER TABLE "project_risk" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "project_risk" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_138e9747c308d68098b566c694" ON "project_risk" ("name", "is_disabled", "sort_order", "code") `,
    );
    await queryRunner.query(`ALTER TABLE "tier_level" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "tier_level" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_f85ac9b25814234deabdb943ea" ON "tier_level" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(`ALTER TABLE "workflow" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "workflow" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_21a97bacb8d918364bfa10fb51" ON "workflow" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(`ALTER TABLE "project_status" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "project_status" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_a8a6fd9f58d45d3dbafdd15df7" ON "project_status" ("name", "is_disabled", "sort_order", "code") `,
    );
    await queryRunner.query(`ALTER TABLE "property_type" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "property_type" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_01d56109ac04623016986a6817" ON "property_type" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ALTER COLUMN "sort_order" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ALTER COLUMN "is_disabled" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90fc9924f1694d2c295e12930c" ON "property_classification" ("name", "is_disabled") `,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ALTER COLUMN "sort_order" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ALTER COLUMN "is_disabled" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_366080f87ea828610afb0e1187" ON "building_predominate_use" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ALTER COLUMN "sort_order" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ALTER COLUMN "is_disabled" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_452a90da034d3278581a826fe8" ON "building_occupant_type" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ALTER COLUMN "sort_order" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ALTER COLUMN "is_disabled" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7b46664f7177866ddcc55dd0a" ON "building_construction_type" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(`ALTER TABLE "agency" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "agency" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_648ccf166d25060756fd37857a" ON "agency" ("id", "name", "is_disabled", "sort_order", "parent_id") `,
    );
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "sort_order" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "is_disabled" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_81ede2167f3239ec87e479fb70" ON "role" ("name", "is_disabled") `,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ALTER COLUMN "sort_order" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ALTER COLUMN "is_disabled" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc733694343c53375cd9457b88" ON "administrative_area" ("name", "is_disabled", "sort_order") `,
    );
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" ADD "date" character varying(10)`);
    await queryRunner.query(`ALTER TABLE "building_evaluation" ADD "Date" character varying(10)`);
  }
}
