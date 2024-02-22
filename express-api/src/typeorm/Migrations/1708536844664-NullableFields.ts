import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableFields1708536844664 implements MigrationInterface {
  name = 'NullableFields1708536844664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_f033e95537c91a7787c7a07c857"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_7611151947b52a71323a46ea46"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f033e95537c91a7787c7a07c85"`);
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "trier_level_id" TO "tier_level_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_8988a5dafec2270a5191a1208cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_e96934a5a81124580dd628602f"`);
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "project_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "to_agency_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_67989daa98d90fafc2087a4871f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ALTER COLUMN "notification_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_b2229cb8dfee8d1c2fe6b78bd91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_d18ff54ded63e964ef42a66880e"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_ef992ea03a65f72e0b69644b35"`);
    await queryRunner.query(
      `ALTER TABLE "project_property" ALTER COLUMN "parcel_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ALTER COLUMN "building_id" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_e4998c66591ebea5e8c1c2d575"`);
    await queryRunner.query(`ALTER TABLE "project_report" ALTER COLUMN "from" DROP NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_88df15c457daadc1d407c6d085" ON "project" ("tier_level_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d29806a012b84ac1d014c563d" ON "project" ("status_id", "tier_level_id", "agency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e96934a5a81124580dd628602f" ON "notification_queue" ("project_id", "template_id", "to_agency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef992ea03a65f72e0b69644b35" ON "project_property" ("project_id", "property_type_id", "parcel_id", "building_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4998c66591ebea5e8c1c2d575" ON "project_report" ("id", "to", "from", "is_final") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_88df15c457daadc1d407c6d085f" FOREIGN KEY ("tier_level_id") REFERENCES "tier_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_8988a5dafec2270a5191a1208cd" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6" FOREIGN KEY ("to_agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_67989daa98d90fafc2087a4871f" FOREIGN KEY ("notification_id") REFERENCES "notification_queue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_b2229cb8dfee8d1c2fe6b78bd91" FOREIGN KEY ("parcel_id") REFERENCES "parcel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_d18ff54ded63e964ef42a66880e" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_d18ff54ded63e964ef42a66880e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_b2229cb8dfee8d1c2fe6b78bd91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_67989daa98d90fafc2087a4871f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_8988a5dafec2270a5191a1208cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_88df15c457daadc1d407c6d085f"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_e4998c66591ebea5e8c1c2d575"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ef992ea03a65f72e0b69644b35"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e96934a5a81124580dd628602f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5d29806a012b84ac1d014c563d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_88df15c457daadc1d407c6d085"`);
    await queryRunner.query(`ALTER TABLE "project_report" ALTER COLUMN "from" SET NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_e4998c66591ebea5e8c1c2d575" ON "project_report" ("id", "is_final", "from", "to") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ALTER COLUMN "building_id" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "project_property" ALTER COLUMN "parcel_id" SET NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_ef992ea03a65f72e0b69644b35" ON "project_property" ("project_id", "property_type_id", "parcel_id", "building_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_d18ff54ded63e964ef42a66880e" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_b2229cb8dfee8d1c2fe6b78bd91" FOREIGN KEY ("parcel_id") REFERENCES "parcel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ALTER COLUMN "notification_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_67989daa98d90fafc2087a4871f" FOREIGN KEY ("notification_id") REFERENCES "notification_queue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "to_agency_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "project_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e96934a5a81124580dd628602f" ON "notification_queue" ("project_id", "to_agency_id", "template_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_c9230eab8c7df3197b3c96dcac6" FOREIGN KEY ("to_agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_8988a5dafec2270a5191a1208cd" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "tier_level_id" TO "trier_level_id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f033e95537c91a7787c7a07c85" ON "project" ("trier_level_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7611151947b52a71323a46ea46" ON "project" ("agency_id", "trier_level_id", "status_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_f033e95537c91a7787c7a07c857" FOREIGN KEY ("trier_level_id") REFERENCES "tier_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
