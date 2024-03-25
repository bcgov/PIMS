import { MigrationInterface, QueryRunner } from 'typeorm';

export class EvaluationYearIntInsteadofDate1711054015973 implements MigrationInterface {
  name = 'EvaluationYearIntInsteadofDate1711054015973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_6f50542eb10a97799164f50313"`);

    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "PK_56529c068e76669017aac4c33f5"`,
    );
    await queryRunner.query(`ALTER TABLE "building_evaluation" ADD "year" integer`);
    await queryRunner.query(`UPDATE "building_evaluation" SET "year" = EXTRACT(year from date)`);
    await queryRunner.query(`ALTER TABLE "building_evaluation" ALTER COLUMN "year" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "building_evaluation" DROP COLUMN "date"`);

    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "PK_090eb947e3bbea372f062ef177a" PRIMARY KEY ("evaluation_key_id", "building_id", "year")`,
    );

    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "PK_aab1bf97521ff997d83e3dc91b2"`,
    );
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" ADD "year" integer`);

    await queryRunner.query(`UPDATE "parcel_evaluation" SET "year" = EXTRACT(year from date)`);
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" ALTER COLUMN "year" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" DROP COLUMN "date"`);

    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "PK_b9971cfcbe9942c6143859f5b23" PRIMARY KEY ("evaluation_key_id", "parcel_id", "year")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b9971cfcbe9942c6143859f5b2" ON "parcel_evaluation" ("parcel_id", "evaluation_key_id", "year") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_b9971cfcbe9942c6143859f5b2"`);
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "PK_b9971cfcbe9942c6143859f5b23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "PK_090eb947e3bbea372f062ef177a"`,
    );

    await queryRunner.query(`ALTER TABLE "building_evaluation" ADD "date" timestamp`);
    await queryRunner.query(
      `UPDATE "building_evaluation" SET "date" = format('01-01-%s', year)::timestamp`,
    );
    await queryRunner.query(`ALTER TABLE "building_evaluation" ALTER COLUMN "date" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "building_evaluation" DROP COLUMN "year"`);

    await queryRunner.query(`ALTER TABLE "parcel_evaluation" ADD "date" timestamp`);
    await queryRunner.query(
      `UPDATE "parcel_evaluation" SET "date" = format('01-01-%s', year)::timestamp`,
    );
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" ALTER COLUMN "date" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "parcel_evaluation" DROP COLUMN "year"`);
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "PK_56529c068e76669017aac4c33f5" PRIMARY KEY ("evaluation_key_id", "building_id", "date")`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "PK_aab1bf97521ff997d83e3dc91b2" PRIMARY KEY ("evaluation_key_id", "parcel_id", "date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f50542eb10a97799164f50313" ON "parcel_evaluation" ("parcel_id", "evaluation_key_id") `,
    );
  }
}
