import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatusEnumInUserTable1707780132021 implements MigrationInterface {
  name = 'StatusEnumInUserTable1707780132021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('Active', 'OnHold', 'Denied', 'Disabled')`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "Status" "public"."user_status_enum"`);
    await queryRunner.query(`UPDATE "user" SET "Status" = 'Active' WHERE "Username" = 'system'`);
    await queryRunner.query(`UPDATE "user" SET "Status" = 'OnHold' WHERE "Status" IS NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "Status" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "Status"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
  }
}
