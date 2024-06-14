import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCompletedOnColumnProjectTasksTable1718127520664 implements MigrationInterface {
  name = 'UpdateCompletedOnColumnProjectTasksTable1718127520664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project_task" ALTER COLUMN "completed_on" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_task" ALTER COLUMN "completed_on" SET DEFAULT now()`,
    );
  }
}
