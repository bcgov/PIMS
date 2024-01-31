import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class ProvincesMigration1706213836608 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFilePath = path.resolve(__dirname, 'Seeds');
    const sqlContent = SqlReader.readSqlFile(path.join(sqlFilePath, 'Provinces_202401241102.sql'));
    await queryRunner.query(sqlContent.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Provinces');
  }
}
