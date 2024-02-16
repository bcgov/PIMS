import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableFields1708123404599 implements MigrationInterface {
  name = 'NullableFields1708123404599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_5d7fe381cc5ac14b88f911c81c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_705c9558182adb03383285e8674"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_359a7aedcd7b3d97fda4bfbc83"`);
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ProjectId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ToAgencyId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_14fa612dd1f3ac554faa62f7ff9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ALTER COLUMN "NotificationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_a580df432f0e0c521225fc3327b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_de366a792fc0aef4f8718e42d9c"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_a8615c36638af5cbe405f58fca"`);
    await queryRunner.query(`ALTER TABLE "project_property" ALTER COLUMN "ParcelId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "project_property" ALTER COLUMN "BuildingId" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_c32ecc1c2fd813140954bdfcc0"`);
    await queryRunner.query(`ALTER TABLE "project_report" ALTER COLUMN "From" DROP NOT NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b000857089edf6cae23b9bc9b8" ON "user" ("Username") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_359a7aedcd7b3d97fda4bfbc83" ON "notification_queue" ("ProjectId", "TemplateId", "ToAgencyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a8615c36638af5cbe405f58fca" ON "project_property" ("ProjectId", "PropertyTypeId", "ParcelId", "BuildingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c32ecc1c2fd813140954bdfcc0" ON "project_report" ("Id", "To", "From", "IsFinal") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_5d7fe381cc5ac14b88f911c81c7" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_705c9558182adb03383285e8674" FOREIGN KEY ("ToAgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_14fa612dd1f3ac554faa62f7ff9" FOREIGN KEY ("NotificationId") REFERENCES "notification_queue"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_a580df432f0e0c521225fc3327b" FOREIGN KEY ("ParcelId") REFERENCES "parcel"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_de366a792fc0aef4f8718e42d9c" FOREIGN KEY ("BuildingId") REFERENCES "building"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_de366a792fc0aef4f8718e42d9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_a580df432f0e0c521225fc3327b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_14fa612dd1f3ac554faa62f7ff9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_705c9558182adb03383285e8674"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_5d7fe381cc5ac14b88f911c81c7"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_c32ecc1c2fd813140954bdfcc0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a8615c36638af5cbe405f58fca"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_359a7aedcd7b3d97fda4bfbc83"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b000857089edf6cae23b9bc9b8"`);
    await queryRunner.query(`ALTER TABLE "project_report" ALTER COLUMN "From" SET NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_c32ecc1c2fd813140954bdfcc0" ON "project_report" ("Id", "IsFinal", "From", "To") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ALTER COLUMN "BuildingId" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "project_property" ALTER COLUMN "ParcelId" SET NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_a8615c36638af5cbe405f58fca" ON "project_property" ("ProjectId", "PropertyTypeId", "ParcelId", "BuildingId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_de366a792fc0aef4f8718e42d9c" FOREIGN KEY ("BuildingId") REFERENCES "building"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_a580df432f0e0c521225fc3327b" FOREIGN KEY ("ParcelId") REFERENCES "parcel"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ALTER COLUMN "NotificationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_14fa612dd1f3ac554faa62f7ff9" FOREIGN KEY ("NotificationId") REFERENCES "notification_queue"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ToAgencyId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ProjectId" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_359a7aedcd7b3d97fda4bfbc83" ON "notification_queue" ("ProjectId", "ToAgencyId", "TemplateId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_705c9558182adb03383285e8674" FOREIGN KEY ("ToAgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_5d7fe381cc5ac14b88f911c81c7" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
