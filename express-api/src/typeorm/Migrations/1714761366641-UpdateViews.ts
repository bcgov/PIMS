import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateViews1714761366641 implements MigrationInterface {
  name = 'UpdateViews1714761366641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW "map_properties" AS 
  (SELECT id, pid, pin, location, property_type_id FROM parcel)
  UNION ALL
  (SELECT id, pid, pin, location, property_type_id FROM building);
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'map_properties',
        '(SELECT id, pid, pin, location, property_type_id FROM parcel)\n  UNION ALL\n  (SELECT id, pid, pin, location, property_type_id FROM building);',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'map_properties', 'public'],
    );
    await queryRunner.query(`DROP VIEW "map_properties"`);
  }
}
