import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class ProjectStatusTransitionsMigration1706730713899 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFilePath = path.resolve(__dirname, 'Seeds');
    const sqlContent = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatusTransitions_202401311020.sql'),
    );
    await queryRunner.query(sqlContent.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('project_status_transitions');
  }
}
