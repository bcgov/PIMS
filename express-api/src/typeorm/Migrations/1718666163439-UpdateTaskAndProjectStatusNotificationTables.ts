import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTaskAndProjectStatusNotificationTables1718666163439
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE task SET status_id = 8 WHERE name = 'Exemption requested'`);
    await queryRunner.query(
      `UPDATE project_status_notification SET from_status_id = NULL WHERE template_id = 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE task SET status_id = 4 WHERE name = 'Exemption requested'`);
    await queryRunner.query(
      `UPDATE project_status_notification SET from_status_id = 6 WHERE template_id = 1`,
    );
  }
}
