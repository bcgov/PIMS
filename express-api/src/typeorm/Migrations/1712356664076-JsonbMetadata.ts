import { MigrationInterface, QueryRunner } from 'typeorm';

export class JsonbMetadata1712356664076 implements MigrationInterface {
  name = 'JsonbMetadata1712356664076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "metadata" TYPE jsonb USING "metadata"::jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ALTER COLUMN "metadata" TYPE jsonb USING "metadata"::jsonb`,
    );

    await queryRunner.query(
      `ALTER TABLE "building" ALTER COLUMN "leased_land_metadata" TYPE jsonb USING "leased_land_metadata"::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "metadata" TYPE text USING "metadata"::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ALTER COLUMN "metadata" TYPE text USING "metadata"::text`,
    );

    await queryRunner.query(
      `ALTER TABLE "building" ALTER COLUMN "leased_land_metadata" TYPE text USING "leased_land_metadata"::text`,
    );
  }
}
