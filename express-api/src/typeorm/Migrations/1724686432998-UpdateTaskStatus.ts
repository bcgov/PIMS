import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTaskStatus1724686432998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE task SET status_id = 14 WHERE id = 3;
    `);
    await queryRunner.query(`
      UPDATE task SET status_id = 15 WHERE id = 4;
    `);
    await queryRunner.query(`
      UPDATE task SET is_optional = true WHERE id = 24;
    `);
    await queryRunner.query(`
      UPDATE timestamp_type SET status_id = 21, is_optional = false WHERE id = 11;
    `);
    await queryRunner.query(`
      UPDATE task SET name = 'Preparation and Due Diligence complete', is_optional = false WHERE id IN (9, 19);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE task SET status_id = 7 WHERE id = 3;
    `);
    await queryRunner.query(`
      UPDATE task SET status_id = 8 WHERE id = 4;
    `);
    await queryRunner.query(`
      UPDATE task SET is_optional = false WHERE id = 24;
    `);
    await queryRunner.query(`
      UPDATE timestamp_type SET status_id = 14, is_optional = true WHERE id = 11;
    `);
    await queryRunner.query(`
      UPDATE task SET name = 'Preparation and due diligence', is_optional = true WHERE id IN (9, 19);
    `);
  }
}
