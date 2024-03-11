import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConstraintUpdates1710182784540 implements MigrationInterface {
  name = 'ConstraintUpdates1710182784540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regional_district" ADD CONSTRAINT "FK_e3abaefeffbfbccf02c2e002b9c" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" ADD CONSTRAINT "FK_f53030d58e4d56d86ba5d63ef25" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_cd4bb1adb34c60427aa6fb9b01f" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_41385dfda73d566335406898746" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_041db0fa9bb4e3daeead3fce0d0" FOREIGN KEY ("approved_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_da38a07feb5a323fd8e5e3a232e" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" ADD CONSTRAINT "FK_f8c26e85de62592cc814f595f65" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" ADD CONSTRAINT "FK_23b82556fb4ce8b297ecc6fbd2f" FOREIGN KEY ("parent_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ADD CONSTRAINT "FK_53e376cb167a686b211ad33db2d" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ADD CONSTRAINT "FK_e2ac1690914f894013061cea7e4" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ADD CONSTRAINT "FK_e8aa6bde9c039eca145986c3f2f" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ADD CONSTRAINT "FK_deb531ed58a26114a6642aa2b64" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" ADD CONSTRAINT "FK_d10713cc1cae6c1b61d583e5b3e" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_5d6e2f281051cbfab6c1a44daf2" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_7bc4efff4a87f914556610a086b" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" ADD CONSTRAINT "FK_2010c82bdbcbbe2e79629c82cde" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_dc464a691f3891e5733d762fcc2" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" ADD CONSTRAINT "FK_3b8980826ae9c52c2e0ac6ee19e" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_82b26695f0c669b4395fb17c831" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" ADD CONSTRAINT "FK_a6787dc5773a2c00508bd7447ac" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" ADD CONSTRAINT "FK_6751772461f57fce9e203dcf85d" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" ADD CONSTRAINT "FK_08ffdc9ae6ae6ca124ae9db94cd" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" ADD CONSTRAINT "FK_7c6ba99fa28bb16b97d1ba23ce8" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_1f3c2190a7a8185fb02bf1132ce" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_277e6a689fa67986b5a362afc50" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" ADD CONSTRAINT "FK_a7ec48ed53543856eb2d46567fa" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_40e432a3ee5a65fb0bb556da61b" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6" FOREIGN KEY ("to_agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_e01a2b76a025a47471d5d83acb1" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_b3fa5fc2bbed7146cd89db29d0a" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_234593ee50cbf9abfa94ee07951" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_b653c60d544435aebf29876566e" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_cbadee06d37b5bce69bde3bb041" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_477c15f5a096a5bb355af60d4fc" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_5c97ebfe7fc9e35798f4c35d8d5" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" ADD CONSTRAINT "FK_d4064898333d3ea2a78cd430c50" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_73b7a8d25a602d1240570b38931" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" ADD CONSTRAINT "FK_e265553eb6e8301b6a298c78196" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" ADD CONSTRAINT "FK_4d3c5d03e8b0d7e639e4f8781ca" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_864fdfa6750198712f2a1408fd4" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_1daea4319d2b27993ea9dc88f09" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_5d8cf279a33236d7aa6c4f5fb10" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_8059210ea047e89826c2b5113fd" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_6d7d7ec563d82168d4741e947d8" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_8e76d803715aab45538108f4a32" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" ADD CONSTRAINT "FK_3e8bbe420553301d54cfef015b6" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_7b1ec81b6623bfde3ac332e0bd7" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_7b1ec81b6623bfde3ac332e0bd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" DROP CONSTRAINT "FK_3e8bbe420553301d54cfef015b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_8e76d803715aab45538108f4a32"`,
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6d7d7ec563d82168d4741e947d8"`);
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_8059210ea047e89826c2b5113fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_5d8cf279a33236d7aa6c4f5fb10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_1daea4319d2b27993ea9dc88f09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_864fdfa6750198712f2a1408fd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" DROP CONSTRAINT "FK_4d3c5d03e8b0d7e639e4f8781ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" DROP CONSTRAINT "FK_e265553eb6e8301b6a298c78196"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_73b7a8d25a602d1240570b38931"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" DROP CONSTRAINT "FK_d4064898333d3ea2a78cd430c50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_5c97ebfe7fc9e35798f4c35d8d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_477c15f5a096a5bb355af60d4fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_cbadee06d37b5bce69bde3bb041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_b653c60d544435aebf29876566e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_234593ee50cbf9abfa94ee07951"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_b3fa5fc2bbed7146cd89db29d0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_e01a2b76a025a47471d5d83acb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_40e432a3ee5a65fb0bb556da61b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" DROP CONSTRAINT "FK_a7ec48ed53543856eb2d46567fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_277e6a689fa67986b5a362afc50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_1f3c2190a7a8185fb02bf1132ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" DROP CONSTRAINT "FK_7c6ba99fa28bb16b97d1ba23ce8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" DROP CONSTRAINT "FK_08ffdc9ae6ae6ca124ae9db94cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" DROP CONSTRAINT "FK_6751772461f57fce9e203dcf85d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" DROP CONSTRAINT "FK_a6787dc5773a2c00508bd7447ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_82b26695f0c669b4395fb17c831"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" DROP CONSTRAINT "FK_3b8980826ae9c52c2e0ac6ee19e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_dc464a691f3891e5733d762fcc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" DROP CONSTRAINT "FK_2010c82bdbcbbe2e79629c82cde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_7bc4efff4a87f914556610a086b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_5d6e2f281051cbfab6c1a44daf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" DROP CONSTRAINT "FK_d10713cc1cae6c1b61d583e5b3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" DROP CONSTRAINT "FK_deb531ed58a26114a6642aa2b64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" DROP CONSTRAINT "FK_e8aa6bde9c039eca145986c3f2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" DROP CONSTRAINT "FK_e2ac1690914f894013061cea7e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" DROP CONSTRAINT "FK_53e376cb167a686b211ad33db2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_23b82556fb4ce8b297ecc6fbd2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_f8c26e85de62592cc814f595f65"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_da38a07feb5a323fd8e5e3a232e"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_041db0fa9bb4e3daeead3fce0d0"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_41385dfda73d566335406898746"`);
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_cd4bb1adb34c60427aa6fb9b01f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" DROP CONSTRAINT "FK_f53030d58e4d56d86ba5d63ef25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" DROP CONSTRAINT "FK_e3abaefeffbfbccf02c2e002b9c"`,
    );
  }
}
