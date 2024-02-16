import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1707763864013 implements MigrationInterface {
  name = 'CreateTables1707763864013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "regional_district" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" integer NOT NULL, "abbreviation" character varying(5) NOT NULL, "name" character varying(250) NOT NULL, CONSTRAINT "PK_8f559368015c2e497eb10358651" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ddba73353dfbcdebaaa1b3ca4" ON "regional_district" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3abaefeffbfbccf02c2e002b9" ON "regional_district" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8f559368015c2e497eb1035865" ON "regional_district" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5ba4000f35f2c39629551c5719" ON "regional_district" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "province" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" character varying(2) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bf027ec58e46c9e7305ffe69c7" ON "province" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f53030d58e4d56d86ba5d63ef2" ON "province" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_aa290c4049a8aa685a81483389" ON "province" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "administrative_area" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "regional_district_id" integer NOT NULL, "province_id" character varying(2) NOT NULL, CONSTRAINT "Unique_Name_RegionalDistrict" UNIQUE ("name", "regional_district_id"), CONSTRAINT "PK_909d1356ce60bd32d25a96bb3d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e22790c1fec0c30bad7b592629" ON "administrative_area" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd4bb1adb34c60427aa6fb9b01" ON "administrative_area" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1168b78afbfc66f5585bc08d56" ON "administrative_area" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0dcd54696b271aa4e57157b1a0" ON "administrative_area" ("regional_district_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc1ddb0698607440db3c8d0f19" ON "administrative_area" ("province_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc733694343c53375cd9457b88" ON "administrative_area" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "agency" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" integer NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "code" character varying(6) NOT NULL, "description" character varying(500), "parent_id" integer, "email" character varying(150), "send_email" boolean NOT NULL, "address_to" character varying(100), "cc_email" character varying(250), CONSTRAINT "PK_ab1244724d1c216e9720635a2e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_569f283ad3e3554d05546f4e8f" ON "agency" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8c26e85de62592cc814f595f6" ON "agency" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_23b82556fb4ce8b297ecc6fbd2" ON "agency" ("parent_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_648ccf166d25060756fd37857a" ON "agency" ("parent_id", "is_disabled", "id", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" uuid NOT NULL, "name" character varying(100) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "keycloak_group_id" uuid, "description" text, "is_public" boolean NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db92db78f9478b3e2fea19934b" ON "role" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_41385dfda73d56633540689874" ON "role" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ae4578dcaed5adff96595e6166" ON "role" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_81ede2167f3239ec87e479fb70" ON "role" ("is_disabled", "name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" uuid NOT NULL, "username" character varying(25) NOT NULL, "display_name" character varying(100) NOT NULL, "first_name" character varying(100) NOT NULL, "middle_name" character varying(100), "last_name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "position" character varying(100), "is_disabled" boolean NOT NULL, "email_verified" boolean NOT NULL, "is_system" boolean NOT NULL, "note" character varying(1000), "last_login" TIMESTAMP, "approved_by_id" uuid, "approved_on" TIMESTAMP, "keycloak_user_id" uuid, "agency_id" integer, "role_id" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b489bba7c2e3d5afcd98a445ff" ON "user" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7a4f92de626d8dc4b05f06ad18" ON "user" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_153314ab22e3d8bac6c328ec5c" ON "user" ("keycloak_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_construction_type" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, CONSTRAINT "PK_08cbc1b9bb5ea287fa8030740c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8152b400e5f86a3818e337767" ON "building_construction_type" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_53e376cb167a686b211ad33db2" ON "building_construction_type" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1a95e64c71dce769afe1d98093" ON "building_construction_type" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7b46664f7177866ddcc55dd0a" ON "building_construction_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_occupant_type" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, CONSTRAINT "PK_2069f7aa1c3bc7dac078fa2470c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6552d8d9810ab2393992116b9" ON "building_occupant_type" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e2ac1690914f894013061cea7e" ON "building_occupant_type" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2ab5e2f818cbb677af0d31d4b2" ON "building_occupant_type" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_452a90da034d3278581a826fe8" ON "building_occupant_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_predominate_use" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, CONSTRAINT "PK_3119ba9980095ed4aa45bb310e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_27a9fe2e77b85db188ed99ea2e" ON "building_predominate_use" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e8aa6bde9c039eca145986c3f2" ON "building_predominate_use" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_827d9672449abec225b6c6644f" ON "building_predominate_use" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_366080f87ea828610afb0e1187" ON "building_predominate_use" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "property_classification" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "is_visible" boolean NOT NULL, CONSTRAINT "PK_e536f12ccacd4870e14c3f88b53" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5b4d66c3d218034835d800adfa" ON "property_classification" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_deb531ed58a26114a6642aa2b6" ON "property_classification" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6080d971d67614de3522306f92" ON "property_classification" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90fc9924f1694d2c295e12930c" ON "property_classification" ("is_disabled", "name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "property_type" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, CONSTRAINT "PK_eb483bf7f6ddf612998949edd26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6d5f92c30de69aa1adb5791aad" ON "property_type" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d10713cc1cae6c1b61d583e5b3" ON "property_type" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7eaccd6dd29d1f98656747edaa" ON "property_type" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_01d56109ac04623016986a6817" ON "property_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(250), "description" character varying(2000), "classification_id" integer NOT NULL, "agency_id" integer, "administrative_area_id" integer NOT NULL, "is_sensitive" boolean NOT NULL, "is_visible_to_other_agencies" boolean NOT NULL, "location" point NOT NULL, "project_numbers" character varying(2000), "property_type_id" integer NOT NULL, "address1" character varying(150), "address2" character varying(150), "postal" character varying(6), "site_id" character varying, "building_construction_type_id" integer NOT NULL, "building_floor_count" integer NOT NULL, "building_predominate_use_id" integer NOT NULL, "building_tenancy" character varying(450) NOT NULL, "rentable_area" real NOT NULL, "building_occupant_type_id" integer NOT NULL, "lease_expiry" TIMESTAMP, "occupant_name" character varying(100), "transfer_lease_on_sale" boolean NOT NULL, "building_tenancy_updated_on" TIMESTAMP, "encumbrance_reason" character varying(500), "leased_land_metadata" character varying(2000), "total_area" real NOT NULL, CONSTRAINT "PK_bbfaf6c11f141a22d2ab105ee5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ed11d5495c59844182bbce1de" ON "building" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d6e2f281051cbfab6c1a44daf" ON "building" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0ca4ff451c07ff2d3ee5df21e" ON "building" ("classification_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7bc4efff4a87f914556610a086" ON "building" ("agency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_580af6f55ba5b523c0acd94ba3" ON "building" ("administrative_area_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_960fc6dc10158fd7207304bdd7" ON "building" ("property_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c465b81adf20f297e365bd105" ON "building" ("address1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9711428159396ff2b8a217a6ce" ON "building" ("building_construction_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f93ed5c4cf5415d931de93fdb" ON "building" ("building_predominate_use_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f2f20f5727c0278f70ab5e07b4" ON "building" ("building_occupant_type_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "evaluation_key" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "description" text, CONSTRAINT "PK_3a36d033aefac8570934641b1bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bfae971e5c8d56462fb32005e6" ON "evaluation_key" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2010c82bdbcbbe2e79629c82cd" ON "evaluation_key" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3e2953243eb87aade9f3f2fa72" ON "evaluation_key" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_evaluation" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "date" TIMESTAMP NOT NULL, "evaluation_key_id" integer NOT NULL, "value" money NOT NULL, "note" character varying(500), "building_id" integer NOT NULL, CONSTRAINT "PK_56529c068e76669017aac4c33f5" PRIMARY KEY ("date", "evaluation_key_id", "building_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91143bf7f711746e64e8f3f2ff" ON "building_evaluation" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc464a691f3891e5733d762fcc" ON "building_evaluation" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e7ee38f8fd593e92b580b548c" ON "building_evaluation" ("building_id", "evaluation_key_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "fiscal_key" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "description" text, CONSTRAINT "PK_fbf0f79c099dbeca6ccd25f3d83" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f8d89fd929d582d4061992be3" ON "fiscal_key" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b8980826ae9c52c2e0ac6ee19" ON "fiscal_key" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a36b714f8cb03620e6e190f095" ON "fiscal_key" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_fiscal" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "fiscal_year" integer NOT NULL, "fiscal_key_id" integer NOT NULL, "value" money NOT NULL, "note" text, "effective_date" TIMESTAMP, "building_id" integer NOT NULL, CONSTRAINT "PK_6e83e6240639957159d530bd079" PRIMARY KEY ("fiscal_year", "fiscal_key_id", "building_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19d19a0a4bee7f4d9a6c52e67c" ON "building_fiscal" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_82b26695f0c669b4395fb17c83" ON "building_fiscal" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fe0580341ac6d08e41b950853f" ON "building_fiscal" ("fiscal_year", "fiscal_key_id", "value") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3a609a2fdf78b63f7bcd1e711" ON "building_fiscal" ("building_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_template" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "to" character varying(500), "cc" character varying(500), "bcc" character varying(500), "audience" character varying(50) NOT NULL, "encoding" character varying(50) NOT NULL, "body_type" character varying(50) NOT NULL, "priority" character varying(50) NOT NULL, "subject" character varying(200) NOT NULL, "body" text, "is_disabled" boolean NOT NULL, "tag" character varying(50), CONSTRAINT "PK_d2a6ef77141a01b8ac31f514cfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4dc5b45b62047720a59096c4bd" ON "notification_template" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7ec48ed53543856eb2d46567f" ON "notification_template" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_038d55f27e3be901c180231021" ON "notification_template" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57f0e8e414beb3cf529299baac" ON "notification_template" ("is_disabled", "tag") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_status" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" integer NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "code" character varying(10) NOT NULL, "group_name" character varying(150), "description" text, "is_milestone" boolean NOT NULL, "is_terminal" boolean NOT NULL, "route" character varying(150) NOT NULL, CONSTRAINT "PK_625ed5469429a6b32e34ba9f827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a4963e770586a37bc71cd6812" ON "project_status" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a6787dc5773a2c00508bd7447a" ON "project_status" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bcea60c9fa0a2fb2be295f486a" ON "project_status" ("code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a8a6fd9f58d45d3dbafdd15df7" ON "project_status" ("is_disabled", "name", "code", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" integer NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "code" character varying(20) NOT NULL, "description" text, CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_850de9126bf49cec75e10d05f3" ON "workflow" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6751772461f57fce9e203dcf85" ON "workflow" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8ec5afd3566bb368910c59f441" ON "workflow" ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_de26b0da4a2499eb21642e26d6" ON "workflow" ("code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_21a97bacb8d918364bfa10fb51" ON "workflow" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "tier_level" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "description" text, CONSTRAINT "PK_fd8cb70e0d638c2ee8b12c05d20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5a547391ad4ddc81704f13e4b7" ON "tier_level" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_08ffdc9ae6ae6ca124ae9db94c" ON "tier_level" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_48548d2c7f9f6854f5e85f98ce" ON "tier_level" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f85ac9b25814234deabdb943ea" ON "tier_level" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_risk" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "code" character varying(10) NOT NULL, "description" text, CONSTRAINT "PK_88e7e918524b163ee8126dc352e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0fef3b1927d70a2351896198f1" ON "project_risk" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c6ba99fa28bb16b97d1ba23ce" ON "project_risk" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b9311ff3ab23669eedd1a2555a" ON "project_risk" ("code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_138e9747c308d68098b566c694" ON "project_risk" ("is_disabled", "code", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "project_number" character varying(25) NOT NULL, "name" character varying(100) NOT NULL, "manager" character varying(150), "reported_fiscal_year" integer NOT NULL, "actual_fiscal_year" integer NOT NULL, "description" text, "metadata" text, "submitted_on" TIMESTAMP, "approved_on" TIMESTAMP, "denied_on" TIMESTAMP, "cancelled_on" TIMESTAMP, "completed_on" TIMESTAMP, "net_book" money, "market" money, "assessed" money, "appraised" money, "project_type" integer NOT NULL, "workflow_id" integer NOT NULL, "agency_id" integer NOT NULL, "trier_level_id" integer NOT NULL, "status_id" integer NOT NULL, "risk_id" integer NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e155d8f98ec858daa457d6ff29" ON "project" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f3c2190a7a8185fb02bf1132c" ON "project" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2efb7c8ec20aa59f7fbc733192" ON "project" ("project_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4628115f61e423da4bc701b05b" ON "project" ("workflow_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_277e6a689fa67986b5a362afc5" ON "project" ("agency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f033e95537c91a7787c7a07c85" ON "project" ("trier_level_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_625ed5469429a6b32e34ba9f82" ON "project" ("status_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_88e7e918524b163ee8126dc352" ON "project" ("risk_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7611151947b52a71323a46ea46" ON "project" ("status_id", "trier_level_id", "agency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_639b27f0bbee7ca7a0e7cd5448" ON "project" ("assessed", "net_book", "market", "reported_fiscal_year", "actual_fiscal_year") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_queue" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "key" uuid NOT NULL, "status" integer NOT NULL, "priority" character varying(50) NOT NULL, "encoding" character varying(50) NOT NULL, "send_on" TIMESTAMP NOT NULL, "to" character varying(500), "subject" character varying(200) NOT NULL, "body_type" character varying(50) NOT NULL, "body" text NOT NULL, "bcc" character varying(500), "cc" character varying(500), "tag" character varying(50), "project_id" integer NOT NULL, "to_agency_id" integer NOT NULL, "template_id" integer NOT NULL, "ches_message_id" uuid NOT NULL, "ches_transaction_id" uuid NOT NULL, CONSTRAINT "PK_60a6aa02d8322bf9912101f47d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20e086e18f1fa5f73a2389322c" ON "notification_queue" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40e432a3ee5a65fb0bb556da61" ON "notification_queue" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_10f0a65d6bccc37357ac2c9f15" ON "notification_queue" ("key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9230eab8c7df3197b3c96dcac" ON "notification_queue" ("to_agency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67a9fe6a893b69d0a42313823d" ON "notification_queue" ("template_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e96934a5a81124580dd628602f" ON "notification_queue" ("project_id", "template_id", "to_agency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d77fa485095da88b7154eed30f" ON "notification_queue" ("status", "send_on", "subject") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parcel" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(250), "description" character varying(2000), "classification_id" integer NOT NULL, "agency_id" integer, "administrative_area_id" integer NOT NULL, "is_sensitive" boolean NOT NULL, "is_visible_to_other_agencies" boolean NOT NULL, "location" point NOT NULL, "project_numbers" character varying(2000), "property_type_id" integer NOT NULL, "address1" character varying(150), "address2" character varying(150), "postal" character varying(6), "site_id" character varying, "pid" integer NOT NULL, "pin" integer, "land_area" real, "land_legal_description" character varying(500), "zoning" character varying(50), "zoning_potential" character varying(50), "not_owned" boolean NOT NULL, "parent_parcel_id" integer, CONSTRAINT "PK_c01e9fed31b7433a00942d506b1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_410f42e0f94fd968e01b261680" ON "parcel" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e01a2b76a025a47471d5d83acb" ON "parcel" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09adfe146690f677557f46a320" ON "parcel" ("classification_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b3fa5fc2bbed7146cd89db29d0" ON "parcel" ("agency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc0a228043caa2215db665e59d" ON "parcel" ("administrative_area_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8c6ae535000a51b32c74d9c42e" ON "parcel" ("property_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b7f3f56f64d5cf60fec914aee4" ON "parcel" ("address1") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b2b62506b1c247926530b027c8" ON "parcel" ("pid", "pin") `,
    );
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
      `CREATE TABLE "project_note" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "project_id" integer NOT NULL, "note_type" integer NOT NULL, "note" text NOT NULL, CONSTRAINT "PK_787a6583b216ce6998c59d324df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a17f12df1bc5e60eae251af496" ON "project_note" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5c97ebfe7fc9e35798f4c35d8d" ON "project_note" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0cc39c692f86c0bbad22a35aa9" ON "project_note" ("project_id", "note_type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_agency_response" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "project_id" integer NOT NULL, "agency_id" integer NOT NULL, "offer_amount" money NOT NULL, "notification_id" integer NOT NULL, "response" integer NOT NULL, "received_on" TIMESTAMP, "note" character varying(2000), CONSTRAINT "PK_a38ff3de87341ea4c3621718316" PRIMARY KEY ("project_id", "agency_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_966d432a7c743390d209311ce8" ON "project_agency_response" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cbadee06d37b5bce69bde3bb04" ON "project_agency_response" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67989daa98d90fafc2087a4871" ON "project_agency_response" ("notification_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_number" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, CONSTRAINT "PK_0b47e726f1bc46b9390fc772fe3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f5a843725258137e97517dc26" ON "project_number" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4064898333d3ea2a78cd430c5" ON "project_number" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parcel_fiscal" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "fiscal_year" integer NOT NULL, "fiscal_key_id" integer NOT NULL, "value" money NOT NULL, "note" text, "effective_date" TIMESTAMP, "parcel_id" integer NOT NULL, CONSTRAINT "PK_ade0e22c63621acca45c8c01e97" PRIMARY KEY ("fiscal_year", "fiscal_key_id", "parcel_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_70d0118cd9e64ecdf1732c3f25" ON "parcel_fiscal" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b653c60d544435aebf29876566" ON "parcel_fiscal" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e2d34dd811e4cd9cfed3609ea4" ON "parcel_fiscal" ("fiscal_year", "fiscal_key_id", "value") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d4590cd556478419404746c62" ON "parcel_fiscal" ("parcel_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_property" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "project_id" integer NOT NULL, "property_type_id" integer NOT NULL, "parcel_id" integer NOT NULL, "building_id" integer NOT NULL, CONSTRAINT "PK_80cdc1cdfc2f9bae401289b28ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb26a7d2ad7439e177705d720c" ON "project_property" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_73b7a8d25a602d1240570b3893" ON "project_property" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef992ea03a65f72e0b69644b35" ON "project_property" ("project_id", "property_type_id", "parcel_id", "building_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "report_type" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "description" text, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, CONSTRAINT "PK_324366e10cf40cf2ac60c502a00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_27db897b6d4c78ab7293341de0" ON "report_type" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e265553eb6e8301b6a298c7819" ON "report_type" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9aeb09a7a15aeab95ef88e9749" ON "report_type" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14f5de982c6b5936636e891b34" ON "report_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_report" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "is_final" boolean NOT NULL, "name" character varying(250), "from" TIMESTAMP NOT NULL, "to" TIMESTAMP NOT NULL, "report_type_id" integer NOT NULL, CONSTRAINT "PK_432e2dd90f9890c20cf96844749" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef5247e76cb327a3a0ea1fa832" ON "project_report" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d3c5d03e8b0d7e639e4f8781c" ON "project_report" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4998c66591ebea5e8c1c2d575" ON "project_report" ("id", "to", "from", "is_final") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_snapshot" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "project_id" integer NOT NULL, "net_book" money, "market" money, "assessed" money, "appraised" money, "snapshot_on" TIMESTAMP NOT NULL, "metadata" text, CONSTRAINT "PK_11c05ea461c7e9692c5b574a8a3" PRIMARY KEY ("id", "project_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c38c77099eb6d76d6f2c11256" ON "project_snapshot" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_864fdfa6750198712f2a1408fd" ON "project_snapshot" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14cd837fc8b02ea28804b11726" ON "project_snapshot" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ce0294bdc697cf48bf8ffcf3b" ON "project_snapshot" ("project_id", "snapshot_on") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_status_notification" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "template_id" integer NOT NULL, "from_status_id" integer, "to_status_id" integer NOT NULL, "priority" integer NOT NULL, "delay" integer NOT NULL, "delay_days" integer NOT NULL, CONSTRAINT "PK_9f7b39671245fd0cc0100a6c996" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f32714f267de8c741bd8bf920d" ON "project_status_notification" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d8cf279a33236d7aa6c4f5fb1" ON "project_status_notification" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_69013a3480c643dca9fa4f1620" ON "project_status_notification" ("template_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0769683fbf02bf9fb98c738197" ON "project_status_notification" ("to_status_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5032a293c8b1191a16535674d2" ON "project_status_notification" ("from_status_id", "to_status_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parcel_evaluation" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "date" TIMESTAMP NOT NULL, "evaluation_key_id" integer NOT NULL, "value" money NOT NULL, "note" character varying(500), "parcel_id" integer NOT NULL, "firm" character varying(150), CONSTRAINT "PK_aab1bf97521ff997d83e3dc91b2" PRIMARY KEY ("date", "evaluation_key_id", "parcel_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ee7cde2dcf20d4f86a082e406" ON "parcel_evaluation" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_234593ee50cbf9abfa94ee0795" ON "parcel_evaluation" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f50542eb10a97799164f50313" ON "parcel_evaluation" ("parcel_id", "evaluation_key_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_status_history" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "project_id" integer NOT NULL, "workflow_id" integer NOT NULL, "status_id" integer NOT NULL, CONSTRAINT "PK_d07a59be210b8e9b5610a117a71" PRIMARY KEY ("id", "project_id", "workflow_id", "status_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_16a8fb80d030981173e9f504ae" ON "project_status_history" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1daea4319d2b27993ea9dc88f0" ON "project_status_history" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19c81903135d9364ed8b7a7702" ON "project_status_history" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e5822955d8e332b0f87bf321c9" ON "project_status_history" ("workflow_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_233b1e713d63e72c6c89c4b4de" ON "project_status_history" ("status_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_status_transition" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "from_workflow_id" integer NOT NULL, "from_status_id" integer NOT NULL, "to_workflow_id" integer NOT NULL, "to_status_id" integer NOT NULL, "action" character varying(100) NOT NULL, "validate_tasks" boolean NOT NULL, CONSTRAINT "PK_7ba0ac3ad301fb1d042a0d9ea64" PRIMARY KEY ("from_workflow_id", "from_status_id", "to_workflow_id", "to_status_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_06f5e17dd6dcbdbb9cd92d0c64" ON "project_status_transition" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8059210ea047e89826c2b5113f" ON "project_status_transition" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f35e96ec0f3b78b8324b0a1ef" ON "project_status_transition" ("from_workflow_id", "from_status_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a95cbb3e28fca6816847ba828" ON "project_status_transition" ("to_workflow_id", "to_status_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, "description" text, "is_optional" boolean NOT NULL, "status_id" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8c02c2c774eff4192dd44533db" ON "task" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6d7d7ec563d82168d4741e947d" ON "task" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a1a5a88a8fb4465f95934e6963" ON "task" ("is_disabled", "is_optional", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_task" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "project_id" integer NOT NULL, "task_id" integer NOT NULL, "is_completed" boolean NOT NULL, "completed_on" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_ee3383543ac39aba7c308896c36" PRIMARY KEY ("project_id", "task_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89b7fe061e35b4030d50f5f17b" ON "project_task" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e76d803715aab45538108f4a3" ON "project_task" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d1f118b6e098a4c1328087e15" ON "project_task" ("task_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b3506c61005b28d90cf07e7f7b" ON "project_task" ("project_id", "task_id", "is_completed", "completed_on") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_type" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "description" text, "is_disabled" boolean NOT NULL, "sort_order" integer NOT NULL, CONSTRAINT "PK_2a06e25261f5e8eb431d3683931" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7207dbe80e3fc3d260218ffe83" ON "project_type" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e8bbe420553301d54cfef015b" ON "project_type" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f6db5b55dec8b2b8a0644b1356" ON "project_type" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_830992b7a8654c0a800c21b00f" ON "project_type" ("is_disabled", "name", "sort_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow_project_status" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP, "workflow_id" integer NOT NULL, "status_id" integer NOT NULL, "sort_order" integer NOT NULL, "is_optional" boolean NOT NULL, CONSTRAINT "PK_923798b735899f65f0eab056c94" PRIMARY KEY ("workflow_id", "status_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a837264fbff4c627088b63664a" ON "workflow_project_status" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b1ec81b6623bfde3ac332e0bd" ON "workflow_project_status" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8e27f9528e46182aaa76f4e28" ON "workflow_project_status" ("workflow_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce10450373e4ef5763e1f62109" ON "workflow_project_status" ("status_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" ADD CONSTRAINT "FK_3ddba73353dfbcdebaaa1b3ca4e" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" ADD CONSTRAINT "FK_e3abaefeffbfbccf02c2e002b9c" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" ADD CONSTRAINT "FK_bf027ec58e46c9e7305ffe69c75" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" ADD CONSTRAINT "FK_f53030d58e4d56d86ba5d63ef25" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_e22790c1fec0c30bad7b5926299" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_cd4bb1adb34c60427aa6fb9b01f" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_0dcd54696b271aa4e57157b1a05" FOREIGN KEY ("regional_district_id") REFERENCES "regional_district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_fc1ddb0698607440db3c8d0f199" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" ADD CONSTRAINT "FK_569f283ad3e3554d05546f4e8fb" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" ADD CONSTRAINT "FK_f8c26e85de62592cc814f595f65" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" ADD CONSTRAINT "FK_23b82556fb4ce8b297ecc6fbd2f" FOREIGN KEY ("parent_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_db92db78f9478b3e2fea19934b3" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_41385dfda73d566335406898746" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_041db0fa9bb4e3daeead3fce0d0" FOREIGN KEY ("approved_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_da38a07feb5a323fd8e5e3a232e" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ADD CONSTRAINT "FK_c8152b400e5f86a3818e337767a" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ADD CONSTRAINT "FK_53e376cb167a686b211ad33db2d" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ADD CONSTRAINT "FK_e6552d8d9810ab2393992116b95" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ADD CONSTRAINT "FK_e2ac1690914f894013061cea7e4" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ADD CONSTRAINT "FK_27a9fe2e77b85db188ed99ea2e9" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ADD CONSTRAINT "FK_e8aa6bde9c039eca145986c3f2f" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ADD CONSTRAINT "FK_5b4d66c3d218034835d800adfa9" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ADD CONSTRAINT "FK_deb531ed58a26114a6642aa2b64" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" ADD CONSTRAINT "FK_6d5f92c30de69aa1adb5791aad4" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" ADD CONSTRAINT "FK_d10713cc1cae6c1b61d583e5b3e" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_1ed11d5495c59844182bbce1de3" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_5d6e2f281051cbfab6c1a44daf2" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_f0ca4ff451c07ff2d3ee5df21e9" FOREIGN KEY ("classification_id") REFERENCES "property_classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_7bc4efff4a87f914556610a086b" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_580af6f55ba5b523c0acd94ba3f" FOREIGN KEY ("administrative_area_id") REFERENCES "administrative_area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_960fc6dc10158fd7207304bdd72" FOREIGN KEY ("property_type_id") REFERENCES "property_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_9711428159396ff2b8a217a6ceb" FOREIGN KEY ("building_construction_type_id") REFERENCES "building_construction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_0f93ed5c4cf5415d931de93fdba" FOREIGN KEY ("building_predominate_use_id") REFERENCES "building_predominate_use"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_f2f20f5727c0278f70ab5e07b44" FOREIGN KEY ("building_occupant_type_id") REFERENCES "building_occupant_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" ADD CONSTRAINT "FK_bfae971e5c8d56462fb32005e6b" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" ADD CONSTRAINT "FK_2010c82bdbcbbe2e79629c82cde" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_91143bf7f711746e64e8f3f2ff9" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_dc464a691f3891e5733d762fcc2" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_3d91b19ac990796308b18b13448" FOREIGN KEY ("evaluation_key_id") REFERENCES "evaluation_key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_d8515ff4753e4f2e99f69c59c87" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" ADD CONSTRAINT "FK_9f8d89fd929d582d4061992be3e" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" ADD CONSTRAINT "FK_3b8980826ae9c52c2e0ac6ee19e" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_19d19a0a4bee7f4d9a6c52e67ca" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_82b26695f0c669b4395fb17c831" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_26ac76828733650fb31ab6219a4" FOREIGN KEY ("fiscal_key_id") REFERENCES "fiscal_key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_f3a609a2fdf78b63f7bcd1e711c" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" ADD CONSTRAINT "FK_4dc5b45b62047720a59096c4bd3" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" ADD CONSTRAINT "FK_a7ec48ed53543856eb2d46567fa" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" ADD CONSTRAINT "FK_1a4963e770586a37bc71cd68122" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" ADD CONSTRAINT "FK_a6787dc5773a2c00508bd7447ac" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" ADD CONSTRAINT "FK_850de9126bf49cec75e10d05f32" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" ADD CONSTRAINT "FK_6751772461f57fce9e203dcf85d" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" ADD CONSTRAINT "FK_5a547391ad4ddc81704f13e4b7b" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" ADD CONSTRAINT "FK_08ffdc9ae6ae6ca124ae9db94cd" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" ADD CONSTRAINT "FK_0fef3b1927d70a2351896198f11" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" ADD CONSTRAINT "FK_7c6ba99fa28bb16b97d1ba23ce8" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_e155d8f98ec858daa457d6ff291" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_1f3c2190a7a8185fb02bf1132ce" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_4628115f61e423da4bc701b05b2" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_277e6a689fa67986b5a362afc50" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_f033e95537c91a7787c7a07c857" FOREIGN KEY ("trier_level_id") REFERENCES "tier_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_625ed5469429a6b32e34ba9f827" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_88e7e918524b163ee8126dc352e" FOREIGN KEY ("risk_id") REFERENCES "project_risk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_20e086e18f1fa5f73a2389322cd" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_40e432a3ee5a65fb0bb556da61b" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_8988a5dafec2270a5191a1208cd" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6" FOREIGN KEY ("to_agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_67a9fe6a893b69d0a42313823d5" FOREIGN KEY ("template_id") REFERENCES "notification_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_410f42e0f94fd968e01b261680d" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_e01a2b76a025a47471d5d83acb1" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_09adfe146690f677557f46a320a" FOREIGN KEY ("classification_id") REFERENCES "property_classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_b3fa5fc2bbed7146cd89db29d0a" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_cc0a228043caa2215db665e59d6" FOREIGN KEY ("administrative_area_id") REFERENCES "administrative_area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_8c6ae535000a51b32c74d9c42e4" FOREIGN KEY ("property_type_id") REFERENCES "property_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_9720341fe17e4c22decf0a0b87f" FOREIGN KEY ("parent_parcel_id") REFERENCES "parcel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_a17f12df1bc5e60eae251af4965" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_5c97ebfe7fc9e35798f4c35d8d5" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_0bb884103bb59b61950f2e8c775" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_966d432a7c743390d209311ce81" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_cbadee06d37b5bce69bde3bb041" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_1a10ab8832932376cb894029eb5" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_477c15f5a096a5bb355af60d4fc" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_67989daa98d90fafc2087a4871f" FOREIGN KEY ("notification_id") REFERENCES "notification_queue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" ADD CONSTRAINT "FK_5f5a843725258137e97517dc26e" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" ADD CONSTRAINT "FK_d4064898333d3ea2a78cd430c50" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_70d0118cd9e64ecdf1732c3f251" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_b653c60d544435aebf29876566e" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_fdb1a5247fd67190ff654a7475b" FOREIGN KEY ("fiscal_key_id") REFERENCES "fiscal_key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_5d4590cd556478419404746c62c" FOREIGN KEY ("parcel_id") REFERENCES "parcel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_eb26a7d2ad7439e177705d720c6" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_73b7a8d25a602d1240570b38931" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_7b7d7ba7b7dd4a2d81f946bf404" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_e91ca497fe9b59fd1e243a2fa14" FOREIGN KEY ("property_type_id") REFERENCES "property_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_b2229cb8dfee8d1c2fe6b78bd91" FOREIGN KEY ("parcel_id") REFERENCES "parcel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_d18ff54ded63e964ef42a66880e" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" ADD CONSTRAINT "FK_27db897b6d4c78ab7293341de05" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" ADD CONSTRAINT "FK_e265553eb6e8301b6a298c78196" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" ADD CONSTRAINT "FK_ef5247e76cb327a3a0ea1fa832d" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" ADD CONSTRAINT "FK_4d3c5d03e8b0d7e639e4f8781ca" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" ADD CONSTRAINT "FK_9bea5cd3cba9cc2b3563206f78b" FOREIGN KEY ("report_type_id") REFERENCES "report_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_7c38c77099eb6d76d6f2c112560" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_864fdfa6750198712f2a1408fd4" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_14cd837fc8b02ea28804b11726e" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_f32714f267de8c741bd8bf920d6" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_5d8cf279a33236d7aa6c4f5fb10" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_69013a3480c643dca9fa4f16208" FOREIGN KEY ("template_id") REFERENCES "notification_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_c573cd000d64cc192f58ad876b7" FOREIGN KEY ("from_status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_0769683fbf02bf9fb98c7381976" FOREIGN KEY ("to_status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_2ee7cde2dcf20d4f86a082e406c" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_234593ee50cbf9abfa94ee07951" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_accddef78fe2622ad866935f680" FOREIGN KEY ("evaluation_key_id") REFERENCES "evaluation_key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_2513fc05ae51fb2622da2afbfbe" FOREIGN KEY ("parcel_id") REFERENCES "parcel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_16a8fb80d030981173e9f504ae3" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_1daea4319d2b27993ea9dc88f09" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_19c81903135d9364ed8b7a77025" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_e5822955d8e332b0f87bf321c9b" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_233b1e713d63e72c6c89c4b4de5" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_06f5e17dd6dcbdbb9cd92d0c649" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_8059210ea047e89826c2b5113fd" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_4b66746df2c62b7de72f0e67081" FOREIGN KEY ("from_workflow_id") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_2ad7770e567ca653d4e8f1344f6" FOREIGN KEY ("from_status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_fd1bdbd3c65a2d556ea320e469f" FOREIGN KEY ("to_workflow_id") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_a73ee3abfad8e26e23d4edff46d" FOREIGN KEY ("to_status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_8c02c2c774eff4192dd44533db3" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_6d7d7ec563d82168d4741e947d8" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_b8747cc6a41b6cef4639babf61d" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_89b7fe061e35b4030d50f5f17b3" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_8e76d803715aab45538108f4a32" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_70c41bad8c4b2510f958f6b9f47" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_0d1f118b6e098a4c1328087e156" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" ADD CONSTRAINT "FK_7207dbe80e3fc3d260218ffe830" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" ADD CONSTRAINT "FK_3e8bbe420553301d54cfef015b6" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_a837264fbff4c627088b63664a4" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_7b1ec81b6623bfde3ac332e0bd7" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_f8e27f9528e46182aaa76f4e28d" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_ce10450373e4ef5763e1f62109e" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_ce10450373e4ef5763e1f62109e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_f8e27f9528e46182aaa76f4e28d"`,
    );
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
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_0d1f118b6e098a4c1328087e156"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_70c41bad8c4b2510f958f6b9f47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_8e76d803715aab45538108f4a32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_89b7fe061e35b4030d50f5f17b3"`,
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_b8747cc6a41b6cef4639babf61d"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6d7d7ec563d82168d4741e947d8"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8c02c2c774eff4192dd44533db3"`);
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_a73ee3abfad8e26e23d4edff46d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_fd1bdbd3c65a2d556ea320e469f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_2ad7770e567ca653d4e8f1344f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_4b66746df2c62b7de72f0e67081"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_8059210ea047e89826c2b5113fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_06f5e17dd6dcbdbb9cd92d0c649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_233b1e713d63e72c6c89c4b4de5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_e5822955d8e332b0f87bf321c9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_19c81903135d9364ed8b7a77025"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_1daea4319d2b27993ea9dc88f09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_16a8fb80d030981173e9f504ae3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_2513fc05ae51fb2622da2afbfbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_accddef78fe2622ad866935f680"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_234593ee50cbf9abfa94ee07951"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_2ee7cde2dcf20d4f86a082e406c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_0769683fbf02bf9fb98c7381976"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_c573cd000d64cc192f58ad876b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_69013a3480c643dca9fa4f16208"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_5d8cf279a33236d7aa6c4f5fb10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_f32714f267de8c741bd8bf920d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_14cd837fc8b02ea28804b11726e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_864fdfa6750198712f2a1408fd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_7c38c77099eb6d76d6f2c112560"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" DROP CONSTRAINT "FK_9bea5cd3cba9cc2b3563206f78b"`,
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
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_d18ff54ded63e964ef42a66880e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_b2229cb8dfee8d1c2fe6b78bd91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_e91ca497fe9b59fd1e243a2fa14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_7b7d7ba7b7dd4a2d81f946bf404"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_73b7a8d25a602d1240570b38931"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_eb26a7d2ad7439e177705d720c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_5d4590cd556478419404746c62c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_fdb1a5247fd67190ff654a7475b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_b653c60d544435aebf29876566e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_70d0118cd9e64ecdf1732c3f251"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" DROP CONSTRAINT "FK_d4064898333d3ea2a78cd430c50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" DROP CONSTRAINT "FK_5f5a843725258137e97517dc26e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_67989daa98d90fafc2087a4871f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_477c15f5a096a5bb355af60d4fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_1a10ab8832932376cb894029eb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_cbadee06d37b5bce69bde3bb041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_966d432a7c743390d209311ce81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_0bb884103bb59b61950f2e8c775"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_5c97ebfe7fc9e35798f4c35d8d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_a17f12df1bc5e60eae251af4965"`,
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
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_9720341fe17e4c22decf0a0b87f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_8c6ae535000a51b32c74d9c42e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_cc0a228043caa2215db665e59d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_b3fa5fc2bbed7146cd89db29d0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_09adfe146690f677557f46a320a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_e01a2b76a025a47471d5d83acb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_410f42e0f94fd968e01b261680d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_67a9fe6a893b69d0a42313823d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_8988a5dafec2270a5191a1208cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_40e432a3ee5a65fb0bb556da61b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_20e086e18f1fa5f73a2389322cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_88e7e918524b163ee8126dc352e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_625ed5469429a6b32e34ba9f827"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_f033e95537c91a7787c7a07c857"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_277e6a689fa67986b5a362afc50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_4628115f61e423da4bc701b05b2"`,
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
      `ALTER TABLE "notification_template" DROP CONSTRAINT "FK_a7ec48ed53543856eb2d46567fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" DROP CONSTRAINT "FK_4dc5b45b62047720a59096c4bd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_f3a609a2fdf78b63f7bcd1e711c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_26ac76828733650fb31ab6219a4"`,
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
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_d8515ff4753e4f2e99f69c59c87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_3d91b19ac990796308b18b13448"`,
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
      `ALTER TABLE "building" DROP CONSTRAINT "FK_f2f20f5727c0278f70ab5e07b44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_0f93ed5c4cf5415d931de93fdba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_9711428159396ff2b8a217a6ceb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_960fc6dc10158fd7207304bdd72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_580af6f55ba5b523c0acd94ba3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_7bc4efff4a87f914556610a086b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_f0ca4ff451c07ff2d3ee5df21e9"`,
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
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_da38a07feb5a323fd8e5e3a232e"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_041db0fa9bb4e3daeead3fce0d0"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_41385dfda73d566335406898746"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_db92db78f9478b3e2fea19934b3"`);
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_23b82556fb4ce8b297ecc6fbd2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_f8c26e85de62592cc814f595f65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_569f283ad3e3554d05546f4e8fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_fc1ddb0698607440db3c8d0f199"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_0dcd54696b271aa4e57157b1a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_cd4bb1adb34c60427aa6fb9b01f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_e22790c1fec0c30bad7b5926299"`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" DROP CONSTRAINT "FK_f53030d58e4d56d86ba5d63ef25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" DROP CONSTRAINT "FK_bf027ec58e46c9e7305ffe69c75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" DROP CONSTRAINT "FK_e3abaefeffbfbccf02c2e002b9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" DROP CONSTRAINT "FK_3ddba73353dfbcdebaaa1b3ca4e"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_ce10450373e4ef5763e1f62109"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f8e27f9528e46182aaa76f4e28"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7b1ec81b6623bfde3ac332e0bd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a837264fbff4c627088b63664a"`);
    await queryRunner.query(`DROP TABLE "workflow_project_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_830992b7a8654c0a800c21b00f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f6db5b55dec8b2b8a0644b1356"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3e8bbe420553301d54cfef015b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7207dbe80e3fc3d260218ffe83"`);
    await queryRunner.query(`DROP TABLE "project_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b3506c61005b28d90cf07e7f7b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0d1f118b6e098a4c1328087e15"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8e76d803715aab45538108f4a3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_89b7fe061e35b4030d50f5f17b"`);
    await queryRunner.query(`DROP TABLE "project_task"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a1a5a88a8fb4465f95934e6963"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6d7d7ec563d82168d4741e947d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8c02c2c774eff4192dd44533db"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1a95cbb3e28fca6816847ba828"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1f35e96ec0f3b78b8324b0a1ef"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8059210ea047e89826c2b5113f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_06f5e17dd6dcbdbb9cd92d0c64"`);
    await queryRunner.query(`DROP TABLE "project_status_transition"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_233b1e713d63e72c6c89c4b4de"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e5822955d8e332b0f87bf321c9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_19c81903135d9364ed8b7a7702"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1daea4319d2b27993ea9dc88f0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_16a8fb80d030981173e9f504ae"`);
    await queryRunner.query(`DROP TABLE "project_status_history"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6f50542eb10a97799164f50313"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_234593ee50cbf9abfa94ee0795"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2ee7cde2dcf20d4f86a082e406"`);
    await queryRunner.query(`DROP TABLE "parcel_evaluation"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5032a293c8b1191a16535674d2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0769683fbf02bf9fb98c738197"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_69013a3480c643dca9fa4f1620"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5d8cf279a33236d7aa6c4f5fb1"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f32714f267de8c741bd8bf920d"`);
    await queryRunner.query(`DROP TABLE "project_status_notification"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2ce0294bdc697cf48bf8ffcf3b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_14cd837fc8b02ea28804b11726"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_864fdfa6750198712f2a1408fd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7c38c77099eb6d76d6f2c11256"`);
    await queryRunner.query(`DROP TABLE "project_snapshot"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e4998c66591ebea5e8c1c2d575"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4d3c5d03e8b0d7e639e4f8781c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ef5247e76cb327a3a0ea1fa832"`);
    await queryRunner.query(`DROP TABLE "project_report"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_14f5de982c6b5936636e891b34"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9aeb09a7a15aeab95ef88e9749"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e265553eb6e8301b6a298c7819"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_27db897b6d4c78ab7293341de0"`);
    await queryRunner.query(`DROP TABLE "report_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ef992ea03a65f72e0b69644b35"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_73b7a8d25a602d1240570b3893"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_eb26a7d2ad7439e177705d720c"`);
    await queryRunner.query(`DROP TABLE "project_property"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5d4590cd556478419404746c62"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e2d34dd811e4cd9cfed3609ea4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b653c60d544435aebf29876566"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_70d0118cd9e64ecdf1732c3f25"`);
    await queryRunner.query(`DROP TABLE "parcel_fiscal"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d4064898333d3ea2a78cd430c5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5f5a843725258137e97517dc26"`);
    await queryRunner.query(`DROP TABLE "project_number"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_67989daa98d90fafc2087a4871"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cbadee06d37b5bce69bde3bb04"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_966d432a7c743390d209311ce8"`);
    await queryRunner.query(`DROP TABLE "project_agency_response"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0cc39c692f86c0bbad22a35aa9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5c97ebfe7fc9e35798f4c35d8d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a17f12df1bc5e60eae251af496"`);
    await queryRunner.query(`DROP TABLE "project_note"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5430f31be522f210ae8ceb5d8e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ab453e13084937c4f6bc93981d"`);
    await queryRunner.query(`DROP TABLE "parcel_building"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b2b62506b1c247926530b027c8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b7f3f56f64d5cf60fec914aee4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8c6ae535000a51b32c74d9c42e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cc0a228043caa2215db665e59d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b3fa5fc2bbed7146cd89db29d0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_09adfe146690f677557f46a320"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e01a2b76a025a47471d5d83acb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_410f42e0f94fd968e01b261680"`);
    await queryRunner.query(`DROP TABLE "parcel"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d77fa485095da88b7154eed30f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e96934a5a81124580dd628602f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_67a9fe6a893b69d0a42313823d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c9230eab8c7df3197b3c96dcac"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_10f0a65d6bccc37357ac2c9f15"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_40e432a3ee5a65fb0bb556da61"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_20e086e18f1fa5f73a2389322c"`);
    await queryRunner.query(`DROP TABLE "notification_queue"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_639b27f0bbee7ca7a0e7cd5448"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7611151947b52a71323a46ea46"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_88e7e918524b163ee8126dc352"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_625ed5469429a6b32e34ba9f82"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f033e95537c91a7787c7a07c85"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_277e6a689fa67986b5a362afc5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4628115f61e423da4bc701b05b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2efb7c8ec20aa59f7fbc733192"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1f3c2190a7a8185fb02bf1132c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e155d8f98ec858daa457d6ff29"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_138e9747c308d68098b566c694"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b9311ff3ab23669eedd1a2555a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7c6ba99fa28bb16b97d1ba23ce"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0fef3b1927d70a2351896198f1"`);
    await queryRunner.query(`DROP TABLE "project_risk"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f85ac9b25814234deabdb943ea"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_48548d2c7f9f6854f5e85f98ce"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_08ffdc9ae6ae6ca124ae9db94c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5a547391ad4ddc81704f13e4b7"`);
    await queryRunner.query(`DROP TABLE "tier_level"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_21a97bacb8d918364bfa10fb51"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_de26b0da4a2499eb21642e26d6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8ec5afd3566bb368910c59f441"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6751772461f57fce9e203dcf85"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_850de9126bf49cec75e10d05f3"`);
    await queryRunner.query(`DROP TABLE "workflow"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a8a6fd9f58d45d3dbafdd15df7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bcea60c9fa0a2fb2be295f486a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a6787dc5773a2c00508bd7447a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1a4963e770586a37bc71cd6812"`);
    await queryRunner.query(`DROP TABLE "project_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_57f0e8e414beb3cf529299baac"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_038d55f27e3be901c180231021"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a7ec48ed53543856eb2d46567f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4dc5b45b62047720a59096c4bd"`);
    await queryRunner.query(`DROP TABLE "notification_template"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f3a609a2fdf78b63f7bcd1e711"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fe0580341ac6d08e41b950853f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_82b26695f0c669b4395fb17c83"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_19d19a0a4bee7f4d9a6c52e67c"`);
    await queryRunner.query(`DROP TABLE "building_fiscal"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a36b714f8cb03620e6e190f095"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3b8980826ae9c52c2e0ac6ee19"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9f8d89fd929d582d4061992be3"`);
    await queryRunner.query(`DROP TABLE "fiscal_key"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0e7ee38f8fd593e92b580b548c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dc464a691f3891e5733d762fcc"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_91143bf7f711746e64e8f3f2ff"`);
    await queryRunner.query(`DROP TABLE "building_evaluation"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3e2953243eb87aade9f3f2fa72"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2010c82bdbcbbe2e79629c82cd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bfae971e5c8d56462fb32005e6"`);
    await queryRunner.query(`DROP TABLE "evaluation_key"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f2f20f5727c0278f70ab5e07b4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0f93ed5c4cf5415d931de93fdb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9711428159396ff2b8a217a6ce"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1c465b81adf20f297e365bd105"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_960fc6dc10158fd7207304bdd7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_580af6f55ba5b523c0acd94ba3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7bc4efff4a87f914556610a086"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f0ca4ff451c07ff2d3ee5df21e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5d6e2f281051cbfab6c1a44daf"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1ed11d5495c59844182bbce1de"`);
    await queryRunner.query(`DROP TABLE "building"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_01d56109ac04623016986a6817"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7eaccd6dd29d1f98656747edaa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d10713cc1cae6c1b61d583e5b3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6d5f92c30de69aa1adb5791aad"`);
    await queryRunner.query(`DROP TABLE "property_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_90fc9924f1694d2c295e12930c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6080d971d67614de3522306f92"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_deb531ed58a26114a6642aa2b6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5b4d66c3d218034835d800adfa"`);
    await queryRunner.query(`DROP TABLE "property_classification"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_366080f87ea828610afb0e1187"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_827d9672449abec225b6c6644f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e8aa6bde9c039eca145986c3f2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_27a9fe2e77b85db188ed99ea2e"`);
    await queryRunner.query(`DROP TABLE "building_predominate_use"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_452a90da034d3278581a826fe8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2ab5e2f818cbb677af0d31d4b2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e2ac1690914f894013061cea7e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e6552d8d9810ab2393992116b9"`);
    await queryRunner.query(`DROP TABLE "building_occupant_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c7b46664f7177866ddcc55dd0a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1a95e64c71dce769afe1d98093"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_53e376cb167a686b211ad33db2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c8152b400e5f86a3818e337767"`);
    await queryRunner.query(`DROP TABLE "building_construction_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9ec779b93060366cbad0029609"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_352664edaa51c51a3f62d1cd8a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8c57de51745f83ebe380ada011"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_50d23da5bb0e560f7bc3961e70"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_153314ab22e3d8bac6c328ec5c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7a4f92de626d8dc4b05f06ad18"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b489bba7c2e3d5afcd98a445ff"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_81ede2167f3239ec87e479fb70"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ae4578dcaed5adff96595e6166"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_41385dfda73d56633540689874"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_db92db78f9478b3e2fea19934b"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_648ccf166d25060756fd37857a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_23b82556fb4ce8b297ecc6fbd2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f8c26e85de62592cc814f595f6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_569f283ad3e3554d05546f4e8f"`);
    await queryRunner.query(`DROP TABLE "agency"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fc733694343c53375cd9457b88"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fc1ddb0698607440db3c8d0f19"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0dcd54696b271aa4e57157b1a0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1168b78afbfc66f5585bc08d56"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cd4bb1adb34c60427aa6fb9b01"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e22790c1fec0c30bad7b592629"`);
    await queryRunner.query(`DROP TABLE "administrative_area"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_aa290c4049a8aa685a81483389"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f53030d58e4d56d86ba5d63ef2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bf027ec58e46c9e7305ffe69c7"`);
    await queryRunner.query(`DROP TABLE "province"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5ba4000f35f2c39629551c5719"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8f559368015c2e497eb1035865"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e3abaefeffbfbccf02c2e002b9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3ddba73353dfbcdebaaa1b3ca4"`);
    await queryRunner.query(`DROP TABLE "regional_district"`);
  }
}
