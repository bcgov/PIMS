import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateXrefTable1729627184522 implements MigrationInterface {
  name = 'CreateXrefTable1729627184522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "jur_roll_pid_xref" ("pid" integer NOT NULL, "jurisdiction_code" character varying(3) NOT NULL, "roll_number" character varying(15) NOT NULL, CONSTRAINT "PK_68f4d54ea088bb438e6100af993" PRIMARY KEY ("pid", "jurisdiction_code", "roll_number"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "jur_roll_pid_xref"`);
  }
}
