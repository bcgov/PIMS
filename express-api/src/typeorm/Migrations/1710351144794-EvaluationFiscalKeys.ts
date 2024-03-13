import { MigrationInterface, QueryRunner } from 'typeorm';

export class EvaluationFiscalKeys1710351144794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('UPDATE fiscal_key SET id = 0 where id = 1;');
    await queryRunner.query('UPDATE fiscal_key SET id = 1 where id = 2;');
    await queryRunner.query('UPDATE evaluation_key SET id = 0 where id = 1;');
    await queryRunner.query('UPDATE evaluation_key SET id = 1 where id = 2;');
    await queryRunner.query('UPDATE evaluation_key SET id = 2 where id = 3;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('UPDATE fiscal_key SET id = 2 where id = 1;');
    await queryRunner.query('UPDATE fiscal_key SET id = 1 where id = 0;');
    await queryRunner.query('UPDATE evaluation_key SET id = 3 where id = 2;');
    await queryRunner.query('UPDATE evaluation_key SET id = 2 where id = 1;');
    await queryRunner.query('UPDATE evaluation_key SET id = 1 where id = 0;');
  }
}
