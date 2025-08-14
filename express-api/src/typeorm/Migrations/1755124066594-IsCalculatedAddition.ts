import { MigrationInterface, QueryRunner } from 'typeorm';

export class IsCalculatedAddition1755124066594 implements MigrationInterface {
  name = 'IsCalculatedAddition1755124066594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monetary_type" ADD "is_calculated" boolean NOT NULL DEFAULT false`,
    );

    await queryRunner.query(
      "UPDATE monetary_type SET is_calculated = true WHERE name = 'ProgramCost'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "monetary_type" DROP COLUMN "is_calculated"`);
  }
}
