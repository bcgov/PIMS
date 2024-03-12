import { MigrationInterface, QueryRunner } from 'typeorm';

export class ParcelBuildingChange1710178740326 implements MigrationInterface {
  name = 'ParcelBuildingChange1710178740326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "building" ADD "pid" integer`);
    await queryRunner.query(`ALTER TABLE "building" ADD "pin" integer`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "regional_district" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "province" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(`DROP INDEX "public"."IDX_648ccf166d25060756fd37857a"`);
    await queryRunner.query(`ALTER TABLE "agency" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "agency_id_seq" OWNED BY "agency"."id"`);
    await queryRunner.query(
      `ALTER TABLE "agency" ALTER COLUMN "id" SET DEFAULT nextval('"agency_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "building" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "fiscal_key" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "workflow" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "tier_level" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "project_risk" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "notification_template" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_b2b62506b1c247926530b027c8"`);
    await queryRunner.query(`ALTER TABLE "parcel" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "parcel" ALTER COLUMN "pid" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "project_task" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_648ccf166d25060756fd37857a" ON "agency" ("parent_id", "is_disabled", "id", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cac35fff060f2e78760a4f77af" ON "building" ("pid", "pin") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b2b62506b1c247926530b027c8" ON "parcel" ("pid", "pin") `,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" DROP CONSTRAINT "FK_470344017e1808fe014bb928ceb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" DROP CONSTRAINT "FK_4082fbe646622fd7b9060dedc0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" DROP CONSTRAINT "FK_5430f31be522f210ae8ceb5d8ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" DROP CONSTRAINT "FK_ab453e13084937c4f6bc93981d7"`,
    );
    await queryRunner.query(`DROP TABLE "parcel_building"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_b2b62506b1c247926530b027c8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cac35fff060f2e78760a4f77af"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_648ccf166d25060756fd37857a"`);
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "project_type" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "project_task" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "project_report" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "report_type" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "project_property" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "project_number" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "project_note" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "parcel_fiscal" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "parcel" ALTER COLUMN "pid" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "parcel" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b2b62506b1c247926530b027c8" ON "parcel" ("pid", "pin") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "project_risk" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "tier_level" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "workflow" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "project_status" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "building_fiscal" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "fiscal_key" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "evaluation_key" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "building" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "property_type" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "property_classification" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "agency" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "agency_id_seq"`);
    await queryRunner.query(`ALTER TABLE "agency" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `CREATE INDEX "IDX_648ccf166d25060756fd37857a" ON "agency" ("id", "name", "is_disabled", "sort_order", "parent_id") `,
    );
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "province" ALTER COLUMN "updated_on" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "regional_district" ALTER COLUMN "updated_on" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "pin"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "pid"`);
    await queryRunner.query(
      `CREATE TABLE "parcel_building" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "parcel_id" integer NOT NULL, "building_id" integer NOT NULL, CONSTRAINT "PK_f35c567f4d2df1c5528181e59e7" PRIMARY KEY ("parcel_id", "building_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab453e13084937c4f6bc93981d" ON "parcel_building" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5430f31be522f210ae8ceb5d8e" ON "parcel_building" ("updated_by_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" ADD CONSTRAINT "FK_ab453e13084937c4f6bc93981d7" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" ADD CONSTRAINT "FK_5430f31be522f210ae8ceb5d8ee" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" ADD CONSTRAINT "FK_4082fbe646622fd7b9060dedc0a" FOREIGN KEY ("parcel_id") REFERENCES "parcel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" ADD CONSTRAINT "FK_470344017e1808fe014bb928ceb" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
