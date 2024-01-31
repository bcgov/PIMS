import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class WorkflowsMigration1706740077437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFilePath = path.resolve(__dirname, 'Seeds');
    const sqlContent = SqlReader.readSqlFile(path.join(sqlFilePath, 'Workflows_202401311420.sql'));
    await queryRunner.query(sqlContent.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('workflows');
  }
}
