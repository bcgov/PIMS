import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class NotificationTemplatesMigration1706652747575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFilePath = path.resolve(__dirname, 'Seeds');
    const sqlContent = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'NotificationTemplates_202401301346.sql'),
    );
    await queryRunner.query(sqlContent.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notification_templates');
  }
}
