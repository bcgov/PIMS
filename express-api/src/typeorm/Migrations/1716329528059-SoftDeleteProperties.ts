import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftDeleteProperties1716329528059 implements MigrationInterface {
  name = 'SoftDeleteProperties1716329528059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "building_fiscal" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "building_fiscal" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "building_evaluation" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "building_evaluation" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "building" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "building" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "parcel_fiscal" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "parcel_fiscal" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "parcel" ADD "deleted_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "parcel" ADD "deleted_on" TIMESTAMP`);
    await queryRunner.query(
      `CREATE INDEX "IDX_1f60805d1d7f61632a8fe96c06" ON "building_fiscal" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5fe7c6f34e75338fcb76e035aa" ON "building_evaluation" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a345c1c202d8f2991eaf99cb95" ON "building" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61401b1577072b6c7b83789637" ON "parcel_fiscal" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c58500ccbc4fa5c2377b471bcb" ON "parcel_evaluation" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61efb0f98894cd15a04e39c3a5" ON "parcel" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_1f60805d1d7f61632a8fe96c061" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_5fe7c6f34e75338fcb76e035aa8" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_a345c1c202d8f2991eaf99cb95d" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_61401b1577072b6c7b837896373" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_c58500ccbc4fa5c2377b471bcb9" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_61efb0f98894cd15a04e39c3a50" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_61efb0f98894cd15a04e39c3a50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_c58500ccbc4fa5c2377b471bcb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_61401b1577072b6c7b837896373"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_a345c1c202d8f2991eaf99cb95d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_5fe7c6f34e75338fcb76e035aa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_1f60805d1d7f61632a8fe96c061"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_61efb0f98894cd15a04e39c3a5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c58500ccbc4fa5c2377b471bcb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_61401b1577072b6c7b83789637"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a345c1c202d8f2991eaf99cb95"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5fe7c6f34e75338fcb76e035aa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1f60805d1d7f61632a8fe96c06"`);
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "parcel_fiscal" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "parcel_fiscal" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "building_evaluation" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "building_evaluation" DROP COLUMN "deleted_by_id"`);
    await queryRunner.query(`ALTER TABLE "building_fiscal" DROP COLUMN "deleted_on"`);
    await queryRunner.query(`ALTER TABLE "building_fiscal" DROP COLUMN "deleted_by_id"`);
  }
}
