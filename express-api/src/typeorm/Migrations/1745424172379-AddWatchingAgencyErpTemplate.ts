import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWatchingAgencyErpTemplate1745424172379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adjust name of Parent Agency intial ERP template
    await queryRunner.query(`
        UPDATE notification_template
        SET name = 'New Properties on ERP - Parent Agencies'
        WHERE name = 'New Properties on ERP';
    `);

    // Add Watching Agency ERP template
    const systemId = await queryRunner.query(`
        SELECT id FROM "user" WHERE username = 'system';
    `);
    await queryRunner.query(`
        INSERT INTO notification_template (name, description, bcc, audience, priority, body_type, encoding, subject, body, tag, created_by_id, "to", cc)
        SELECT 'New Properties on ERP - Purchasing Agencies', description, bcc, 'WatchingAgencies', priority, body_type, encoding, subject, body, tag, '${systemId.at(0).id}', "to", cc
        FROM notification_template
        WHERE audience = 'ParentAgencies'
            AND name = 'New Properties on ERP - Parent Agencies';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove Watching Agency ERP template
    await queryRunner.query(`
        DELETE FROM notification_template
        WHERE name = 'New Properties on ERP - Purchasing Agencies';
    `);

    // Revert name of Parent Agency intial ERP template
    await queryRunner.query(`
        UPDATE notification_template
        SET name = 'New Properties on ERP'
        WHERE name = 'New Properties on ERP - Parent Agencies';
    `);
  }
}
