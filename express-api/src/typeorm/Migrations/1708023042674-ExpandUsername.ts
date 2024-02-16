import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandUsername1708023042674 implements MigrationInterface {
  name = 'ExpandUsername1708023042674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "Username" TYPE character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "Username" TYPE character varying(25)`,
    );
  }
}
