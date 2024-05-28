import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectNoteUniqueIndex1716854270095 implements MigrationInterface {
  name = 'ProjectNoteUniqueIndex1716854270095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_0cc39c692f86c0bbad22a35aa9"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0cc39c692f86c0bbad22a35aa9" ON "project_note" ("project_id", "note_type") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_0cc39c692f86c0bbad22a35aa9"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_0cc39c692f86c0bbad22a35aa9" ON "project_note" ("project_id", "note_type") `,
    );
  }
}
