import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLegalLandDescription1724108452907 implements MigrationInterface {
  name = 'RemoveLegalLandDescription1724108452907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "land_legal_description"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD "land_legal_description" character varying(500)`,
    );
  }
}
