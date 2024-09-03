import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageToImport1724454425646 implements MigrationInterface {
  name = 'AddMessageToImport1724454425646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "import_result" ADD "message" character varying(250)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "import_result" DROP COLUMN "message"`);
  }
}
