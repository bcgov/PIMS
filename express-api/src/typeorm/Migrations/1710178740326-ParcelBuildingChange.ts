import { MigrationInterface, QueryRunner } from 'typeorm';

export class ParcelBuildingChange1710178740326 implements MigrationInterface {
  name = 'ParcelBuildingChange1710178740326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "building" ADD "pid" integer`);
    await queryRunner.query(`ALTER TABLE "building" ADD "pin" integer`);
    await queryRunner.query(
      `ALTER TABLE "regional_district" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "province" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ALTER COLUMN "updated_on" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "regional_district" DROP CONSTRAINT "FK_e3abaefeffbfbccf02c2e002b9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" DROP CONSTRAINT "FK_f53030d58e4d56d86ba5d63ef25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_cd4bb1adb34c60427aa6fb9b01f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_f8c26e85de62592cc814f595f65"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_41385dfda73d566335406898746"`);
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" DROP CONSTRAINT "FK_53e376cb167a686b211ad33db2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" DROP CONSTRAINT "FK_e2ac1690914f894013061cea7e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" DROP CONSTRAINT "FK_e8aa6bde9c039eca145986c3f2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" DROP CONSTRAINT "FK_deb531ed58a26114a6642aa2b64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" DROP CONSTRAINT "FK_d10713cc1cae6c1b61d583e5b3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_5d6e2f281051cbfab6c1a44daf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" DROP CONSTRAINT "FK_2010c82bdbcbbe2e79629c82cde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_dc464a691f3891e5733d762fcc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" DROP CONSTRAINT "FK_3b8980826ae9c52c2e0ac6ee19e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_82b26695f0c669b4395fb17c831"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" DROP CONSTRAINT "FK_a7ec48ed53543856eb2d46567fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" DROP CONSTRAINT "FK_a6787dc5773a2c00508bd7447ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" DROP CONSTRAINT "FK_6751772461f57fce9e203dcf85d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" DROP CONSTRAINT "FK_08ffdc9ae6ae6ca124ae9db94cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" DROP CONSTRAINT "FK_7c6ba99fa28bb16b97d1ba23ce8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_1f3c2190a7a8185fb02bf1132ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_40e432a3ee5a65fb0bb556da61b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_e01a2b76a025a47471d5d83acb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_5c97ebfe7fc9e35798f4c35d8d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_cbadee06d37b5bce69bde3bb041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" DROP CONSTRAINT "FK_d4064898333d3ea2a78cd430c50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_b653c60d544435aebf29876566e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_73b7a8d25a602d1240570b38931"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" DROP CONSTRAINT "FK_e265553eb6e8301b6a298c78196"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" DROP CONSTRAINT "FK_4d3c5d03e8b0d7e639e4f8781ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_864fdfa6750198712f2a1408fd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_5d8cf279a33236d7aa6c4f5fb10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_234593ee50cbf9abfa94ee07951"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_1daea4319d2b27993ea9dc88f09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_8059210ea047e89826c2b5113fd"`,
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6d7d7ec563d82168d4741e947d8"`);
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_8e76d803715aab45538108f4a32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" DROP CONSTRAINT "FK_3e8bbe420553301d54cfef015b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_7b1ec81b6623bfde3ac332e0bd7"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_041db0fa9bb4e3daeead3fce0d0"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8"`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_on" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_23b82556fb4ce8b297ecc6fbd2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_7bc4efff4a87f914556610a086b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_277e6a689fa67986b5a362afc50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_b3fa5fc2bbed7146cd89db29d0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_477c15f5a096a5bb355af60d4fc"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_da38a07feb5a323fd8e5e3a232e"`);
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_7b1ec81b6623bfde3ac332e0bd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_a837264fbff4c627088b63664a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" DROP CONSTRAINT "FK_3e8bbe420553301d54cfef015b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" DROP CONSTRAINT "FK_7207dbe80e3fc3d260218ffe830"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_8e76d803715aab45538108f4a32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_89b7fe061e35b4030d50f5f17b3"`,
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6d7d7ec563d82168d4741e947d8"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8c02c2c774eff4192dd44533db3"`);
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_8059210ea047e89826c2b5113fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_06f5e17dd6dcbdbb9cd92d0c649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_5d8cf279a33236d7aa6c4f5fb10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_f32714f267de8c741bd8bf920d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_1daea4319d2b27993ea9dc88f09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_16a8fb80d030981173e9f504ae3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_864fdfa6750198712f2a1408fd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_7c38c77099eb6d76d6f2c112560"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" DROP CONSTRAINT "FK_4d3c5d03e8b0d7e639e4f8781ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" DROP CONSTRAINT "FK_ef5247e76cb327a3a0ea1fa832d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" DROP CONSTRAINT "FK_e265553eb6e8301b6a298c78196"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" DROP CONSTRAINT "FK_27db897b6d4c78ab7293341de05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_73b7a8d25a602d1240570b38931"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_eb26a7d2ad7439e177705d720c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" DROP CONSTRAINT "FK_d4064898333d3ea2a78cd430c50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" DROP CONSTRAINT "FK_5f5a843725258137e97517dc26e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_5c97ebfe7fc9e35798f4c35d8d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_a17f12df1bc5e60eae251af4965"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_477c15f5a096a5bb355af60d4fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_cbadee06d37b5bce69bde3bb041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_966d432a7c743390d209311ce81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_b653c60d544435aebf29876566e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_70d0118cd9e64ecdf1732c3f251"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_234593ee50cbf9abfa94ee07951"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_2ee7cde2dcf20d4f86a082e406c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_b3fa5fc2bbed7146cd89db29d0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_e01a2b76a025a47471d5d83acb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_410f42e0f94fd968e01b261680d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_40e432a3ee5a65fb0bb556da61b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_20e086e18f1fa5f73a2389322cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" DROP CONSTRAINT "FK_a7ec48ed53543856eb2d46567fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" DROP CONSTRAINT "FK_4dc5b45b62047720a59096c4bd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_277e6a689fa67986b5a362afc50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_1f3c2190a7a8185fb02bf1132ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_e155d8f98ec858daa457d6ff291"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" DROP CONSTRAINT "FK_7c6ba99fa28bb16b97d1ba23ce8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" DROP CONSTRAINT "FK_0fef3b1927d70a2351896198f11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" DROP CONSTRAINT "FK_08ffdc9ae6ae6ca124ae9db94cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" DROP CONSTRAINT "FK_5a547391ad4ddc81704f13e4b7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" DROP CONSTRAINT "FK_6751772461f57fce9e203dcf85d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" DROP CONSTRAINT "FK_850de9126bf49cec75e10d05f32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" DROP CONSTRAINT "FK_a6787dc5773a2c00508bd7447ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" DROP CONSTRAINT "FK_1a4963e770586a37bc71cd68122"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_82b26695f0c669b4395fb17c831"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_19d19a0a4bee7f4d9a6c52e67ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" DROP CONSTRAINT "FK_3b8980826ae9c52c2e0ac6ee19e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" DROP CONSTRAINT "FK_9f8d89fd929d582d4061992be3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_dc464a691f3891e5733d762fcc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_91143bf7f711746e64e8f3f2ff9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" DROP CONSTRAINT "FK_2010c82bdbcbbe2e79629c82cde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" DROP CONSTRAINT "FK_bfae971e5c8d56462fb32005e6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_7bc4efff4a87f914556610a086b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_5d6e2f281051cbfab6c1a44daf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_1ed11d5495c59844182bbce1de3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" DROP CONSTRAINT "FK_d10713cc1cae6c1b61d583e5b3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" DROP CONSTRAINT "FK_6d5f92c30de69aa1adb5791aad4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" DROP CONSTRAINT "FK_deb531ed58a26114a6642aa2b64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" DROP CONSTRAINT "FK_5b4d66c3d218034835d800adfa9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" DROP CONSTRAINT "FK_e8aa6bde9c039eca145986c3f2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" DROP CONSTRAINT "FK_27a9fe2e77b85db188ed99ea2e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" DROP CONSTRAINT "FK_e2ac1690914f894013061cea7e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" DROP CONSTRAINT "FK_e6552d8d9810ab2393992116b95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" DROP CONSTRAINT "FK_53e376cb167a686b211ad33db2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" DROP CONSTRAINT "FK_c8152b400e5f86a3818e337767a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_23b82556fb4ce8b297ecc6fbd2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_f8c26e85de62592cc814f595f65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_569f283ad3e3554d05546f4e8fb"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_da38a07feb5a323fd8e5e3a232e"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_041db0fa9bb4e3daeead3fce0d0"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_41385dfda73d566335406898746"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_db92db78f9478b3e2fea19934b3"`);
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
  }
}
