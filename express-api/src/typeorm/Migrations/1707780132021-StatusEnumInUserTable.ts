import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatusEnumInUserTable1707780132021 implements MigrationInterface {
  name = 'StatusEnumInUserTable1707780132021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE public.user_status_enum AS ENUM('Active', 'OnHold', 'Denied', 'Disabled')`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD status public.user_status_enum`);
    await queryRunner.query(`UPDATE "user" SET status = 'Active' WHERE "username" = 'system'`);
    await queryRunner.query(`UPDATE "user" SET status = 'OnHold' WHERE "status" IS NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN status SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN status`);
    await queryRunner.query(`DROP TYPE public.user_status_enum`);
  }
}
