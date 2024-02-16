import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableFields1708104421858 implements MigrationInterface {
  name = 'NullableFields1708104421858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "ParentID"`);
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
      `CREATE INDEX "IDX_a8615c36638af5cbe405f58fca" ON "project_property" ("ProjectId", "PropertyTypeId", "ParcelId", "BuildingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c32ecc1c2fd813140954bdfcc0" ON "project_report" ("Id", "To", "From", "IsFinal") `,
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
    await queryRunner.query(`DROP INDEX "public"."IDX_c32ecc1c2fd813140954bdfcc0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a8615c36638af5cbe405f58fca"`);
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
    await queryRunner.query(`ALTER TABLE "parcel" ADD "ParentID" integer`);
  }
}
