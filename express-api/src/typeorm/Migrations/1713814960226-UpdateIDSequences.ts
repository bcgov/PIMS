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
];

export class UpdateIDSequences1713814960226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Executing up method of migration...');
    for (const table of tables) {
      console.log(`Updating sequence for table ${table}...`);
      await queryRunner.query(
        `SELECT setval('${table}_id_seq', (SELECT COALESCE(MAX(id), 0) FROM ${table}));`,
      );
    }

    console.log('Migration up method executed successfully.');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of tables) {
      const sequence = `${table}_id_seq`;
      try {
        console.log(`Restarting sequence ${sequence}...`);
        // Query the maximum ID from the table
        const result = await queryRunner.query(
          `SELECT COALESCE(MAX(id), 0) AS max_id FROM ${table};`,
        );
        const maxId = parseInt(result[0].max_id) || 0;

        // Reset the sequence to max ID + 1
        await queryRunner.query(`ALTER SEQUENCE "${sequence}" RESTART WITH ${maxId + 1};`);

        console.log(`Sequence ${sequence} restarted successfully.`);
      } catch (error) {
        console.error(`Error restarting sequence ${sequence}:`, error);
      }
    }

    console.log('Migration down method executed successfully.');
  }
}
