import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectNumberSequence1712773891915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SEQUENCE IF NOT EXISTS project_num_seq MINVALUE 14000');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP SEQUENCE IF EXISTS project_num_seq');
  }
}
