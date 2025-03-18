import { MigrationInterface, QueryRunner } from 'typeorm';

export class DisableDuplicateAccessRequestTemplate1742330142778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE notification_template SET "to" = 'RealPropertyDivision.Disposals@gov.bc.ca' WHERE id = 17;`,
    );
    await queryRunner.query(`UPDATE notification_template SET is_disabled = True WHERE id = 15;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE notification_template SET "to" = '' WHERE id = 17;`);
    await queryRunner.query(`UPDATE notification_template SET is_disabled = False WHERE id = 15;`);
  }
}
