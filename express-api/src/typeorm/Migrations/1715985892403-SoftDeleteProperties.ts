import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftDeleteProperties1715985892403 implements MigrationInterface {
  name = 'SoftDeleteProperties1715985892403';

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
