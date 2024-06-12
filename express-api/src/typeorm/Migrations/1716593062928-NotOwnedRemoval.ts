import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotOwnedRemoval1716593062928 implements MigrationInterface {
  name = 'NotOwnedRemoval1716593062928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "not_owned"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "parcel" ADD "not_owned" boolean NOT NULL default FALSE`);
  }
}
