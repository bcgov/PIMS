import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTaskStatus1724686432998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          UPDATE task SET status_id = 14 WHERE id = 3;
        `);
    await queryRunner.query(`
          UPDATE task SET status_id = 15 WHERE id = 4;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          UPDATE task SET status_id = 7 WHERE id = 3;
        `);
    await queryRunner.query(`
          UPDATE task SET status_id = 8 WHERE id = 4;
        `);
  }
}
