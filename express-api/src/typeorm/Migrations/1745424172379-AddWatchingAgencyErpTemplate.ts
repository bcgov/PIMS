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
    // Insert record into project_status_notification so template will be triggered on status change
    const newTemplate = await queryRunner.query(`
      SELECT * FROM notification_template
      WHERE name = 'New Properties on ERP - Purchasing Agencies';
    `);
    const templateId = newTemplate.at(0).id;
    const erpStatus = await queryRunner.query(`
      SELECT id FROM project_status WHERE name = 'Approved for ERP';
      `);
    const statusId = erpStatus.at(0).id;
    await queryRunner.query(`
      INSERT INTO project_status_notification (template_id, from_status_id, to_status_id, priority, delay, delay_days, created_by_id)
      VALUES (${templateId}, NULL, ${statusId}, 2, 0, 0, '${systemId.at(0).id}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Identify template id
    const newTemplate = await queryRunner.query(`
      SELECT * FROM notification_template
      WHERE name = 'New Properties on ERP - Purchasing Agencies';
  `);
    const templateId = newTemplate.at(0).id;
    // Remove record from project_status_notification
    await queryRunner.query(`
      DELETE FROM project_status_notification
      WHERE template_id = ${templateId};
    `);
    // Remove Watching Agency ERP template
    await queryRunner.query(`
      DELETE FROM notification_template
      WHERE id = ${templateId};
    `);
    // Revert name of Parent Agency intial ERP template
    await queryRunner.query(`
      UPDATE notification_template
      SET name = 'New Properties on ERP'
      WHERE name = 'New Properties on ERP - Parent Agencies';
    `);
  }
}
