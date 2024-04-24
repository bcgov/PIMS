import logger from '@/utilities/winstonLogger';
import { MigrationInterface, QueryRunner } from 'typeorm';

const tables = [
  'agency',
  'administrative_area',
  'building',
  'parcel',
  'project',
  'project_note',
  'notification_queue',
  'notification_template',
  'project_property',
  'project_report',
  'project_snapshot',
  'project_status_history',
];

export class UpdateIDSequences1713814960226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of tables) {
      await queryRunner.query(
        `SELECT setval('${table}_id_seq', (SELECT COALESCE(MAX(id), 1) FROM ${table}));`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of tables) {
      const sequence = `${table}_id_seq`;
      try {
        // Query the maximum ID from the table
        const result = await queryRunner.query(
          `SELECT COALESCE(MAX(id), 1) AS max_id FROM ${table};`,
        );
        const maxId = parseInt(result[0].max_id) || 1;

        // Reset the sequence to max ID + 1
        await queryRunner.query(`ALTER SEQUENCE "${sequence}" RESTART WITH ${maxId + 1};`);
      } catch (error) {
        logger.error(`Error restarting sequence ${sequence}:`, error);
      }
    }
  }
}
