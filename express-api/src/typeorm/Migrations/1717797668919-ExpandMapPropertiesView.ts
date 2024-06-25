import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandMapPropertiesView1717797668919 implements MigrationInterface {
  name = 'ExpandMapPropertiesView1717797668919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'map_properties', 'public'],
    );
    await queryRunner.query(`DROP VIEW "map_properties"`);

    await queryRunner.query(`CREATE VIEW "map_properties" AS 
    SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.is_visible_to_other_agencies, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id
    FROM (
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name 
      FROM parcel
      UNION ALL
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name 
      FROM building
    ) c
    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;  
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'map_properties',
        'SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.is_visible_to_other_agencies, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id\n    FROM (\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name \n      FROM parcel\n      UNION ALL\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name \n      FROM building\n    ) c\n    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'map_properties', 'public'],
    );
    await queryRunner.query(`DROP VIEW "map_properties"`);

    await queryRunner.query(`CREATE VIEW "map_properties" AS (SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name FROM parcel)
  UNION ALL
  (SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name FROM building);`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'map_properties',
        '(SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name FROM parcel)\n  UNION ALL\n  (SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name FROM building);',
      ],
    );
  }
}
