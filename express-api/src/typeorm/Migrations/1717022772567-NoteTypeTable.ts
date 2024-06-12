import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../Entities/User';

export class NoteTypeTable1717022772567 implements MigrationInterface {
  name = 'NoteTypeTable1717022772567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_0cc39c692f86c0bbad22a35aa9"`);
    await queryRunner.query(
      `ALTER TABLE "project_note" RENAME COLUMN "note_type" TO "note_type_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "note_type" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL DEFAULT false, "sort_order" integer NOT NULL DEFAULT '0', "description" text, "is_optional" boolean NOT NULL, "status_id" integer, CONSTRAINT "PK_c80a9fb97bd099d9e1da0b17d7a" PRIMARY KEY ("id"))`,
    );
    const user = await queryRunner.manager.findOne(User, {
      where: { Username: 'system' },
    });
    const created_by_id = user.Id;
    await queryRunner.query(
      `INSERT INTO "note_type" (id, name, description, is_optional, created_by_id, status_id) VALUES 
        (0, 'General', 'General default notes.', true, '${created_by_id}', NULL),
        (1, 'Public', 'Publically shared notes.', true, '${created_by_id}', 4),
        (2, 'Private', 'Private notes only visible to SRES.', true, '${created_by_id}', 4),
        (3, 'Exemption', 'Exception notes.', true, '${created_by_id}', 15),
        (4, 'AgencyInterest', 'ERP agency interest notes.', true, '${created_by_id}', 14),
        (5, 'Financial', 'Financial notes.', true, '${created_by_id}', NULL),
        (6, 'PreMarketing', 'Pre-marketing notes for SPL.', true, '${created_by_id}', 40),
        (7, 'Marketing', 'Marketing notes for SPL.', true, '${created_by_id}', 41),
        (8, 'ContractInPlace', 'Contract in place notes for SPL.', true, '${created_by_id}', 42),
        (9, 'Reporting', 'Notes to include in reports.', true, '${created_by_id}', 4),
        (10, 'LoanTerms', 'Loan term notes.', true, '${created_by_id}', NULL),
        (11, 'Adjustment', 'Adjustment notes.', true, '${created_by_id}', 21),
        (12, 'SplCost', 'SPL program cost notes.', true, '${created_by_id}', 21),
        (13, 'SplGain', 'SPL gain or loss notes.', true, '${created_by_id}', 21),
        (14, 'SalesHistory', 'Sales history notes.', true, '${created_by_id}', 21),
        (15, 'CloseOut', 'Close out form notes.', true, '${created_by_id}', 21),
        (16, 'Comments', 'General comments.', true, '${created_by_id}', 21),
        (17, 'Appraisal', 'Appraisal note.', true, '${created_by_id}', 11),
        (18, 'Offer', 'A purchaser has made an offer.', true, '${created_by_id}', 32),
        (19, 'Remediation', 'A disposed project remediation note.', true, '${created_by_id}', 21),
        (20, 'SplRemoval', 'Rational for being removed from SPL.', true, '${created_by_id}', 22),
        (21, 'Documentation', 'Notes related to the provided documentation.', true, '${created_by_id}', NULL),
        (22, 'ErpNotification', 'Notes displayed on ERP notifications.', true, '${created_by_id}', NULL) `,
    );
    await queryRunner.query(`SELECT setval('note_type_id_seq', 22, true) `);
    await queryRunner.query(
      `CREATE INDEX "IDX_19cd619aa65bfa46266b8f32d0" ON "note_type" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9cbd7b88773663747deab7f11" ON "note_type" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_127297989432f659205b1bcf07" ON "project_note" ("project_id", "note_type_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "note_type" ADD CONSTRAINT "FK_19cd619aa65bfa46266b8f32d05" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_type" ADD CONSTRAINT "FK_c9cbd7b88773663747deab7f111" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_type" ADD CONSTRAINT "FK_63b900914608619d1fb8b590d53" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_71380cf2acd3dfe2c16b4eab549" FOREIGN KEY ("note_type_id") REFERENCES "note_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_71380cf2acd3dfe2c16b4eab549"`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_type" DROP CONSTRAINT "FK_63b900914608619d1fb8b590d53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_type" DROP CONSTRAINT "FK_c9cbd7b88773663747deab7f111"`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_type" DROP CONSTRAINT "FK_19cd619aa65bfa46266b8f32d05"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_127297989432f659205b1bcf07"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c9cbd7b88773663747deab7f11"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_19cd619aa65bfa46266b8f32d0"`);
    await queryRunner.query(`DROP TABLE "note_type"`);
    await queryRunner.query(
      `ALTER TABLE "project_note" RENAME COLUMN "note_type_id" TO "note_type"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0cc39c692f86c0bbad22a35aa9" ON "project_note" ("project_id", "note_type") `,
    );
  }
}
