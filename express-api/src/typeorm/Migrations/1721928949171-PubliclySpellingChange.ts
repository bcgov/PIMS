import { MigrationInterface, QueryRunner } from 'typeorm';

export class PubliclySpellingChange1721928949171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "note_type" SET description ='Publicly shared notes.'
        WHERE id=1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "note_type" SET description ='Publically shared notes.'
        WHERE id=1`,
    );
  }
}
