import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class ReportTypes1707327242712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFilePath = path.resolve(__dirname, 'Seeds');
    const sqlContent = SqlReader.readSqlFile(path.join(sqlFilePath, ''));
    await queryRunner.query(sqlContent.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE report_types;');
  }
}
