import { MigrationInterface, QueryRunner } from 'typeorm';

export class PropertyViewsMissingDeletedOnClause1722362022034 implements MigrationInterface {
  name = 'PropertyViewsMissingDeletedOnClause1722362022034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'property_union', 'public'],
    );
    await queryRunner.query(`DROP VIEW "property_union"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'map_properties', 'public'],
    );
    await queryRunner.query(`DROP VIEW "map_properties"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'building_relations', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "building_relations"`);
    await queryRunner.query(`CREATE VIEW "building_relations" AS 
    SELECT b.id AS "building_id", b.pid, b.pin, p.id as "parcel_id"
    FROM building b
    LEFT OUTER JOIN parcel p
    ON (b.pid = p.pid OR b.pin = p.pin) AND p.deleted_on IS NULL
    WHERE b.deleted_on IS NULL;
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'building_relations',
        'SELECT b.id AS "building_id", b.pid, b.pin, p.id as "parcel_id"\n    FROM building b\n    LEFT OUTER JOIN parcel p\n    ON (b.pid = p.pid OR b.pin = p.pin) AND p.deleted_on IS NULL\n    WHERE b.deleted_on IS NULL;',
      ],
    );
    await queryRunner.query(`CREATE VIEW "map_properties" AS 
    SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.is_visible_to_other_agencies, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id
    FROM (
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name 
      FROM parcel WHERE deleted_on IS NULL
      UNION ALL
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name 
      FROM building WHERE deleted_on IS NULL
    ) c
    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;  
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'map_properties',
        'SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.is_visible_to_other_agencies, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id\n    FROM (\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name \n      FROM parcel WHERE deleted_on IS NULL\n      UNION ALL\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name \n      FROM building WHERE deleted_on IS NULL\n    ) c\n    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;',
      ],
    );
    await queryRunner.query(`CREATE VIEW "property_union" AS WITH property AS (SELECT 
	'Parcel' AS property_type,
  property_type_id,
	id,
	classification_id,
	pid,
	pin,
	agency_id,
	address1,
	administrative_area_id,
	is_sensitive,
	updated_on,
	land_area
FROM parcel p
WHERE deleted_on IS NULL
UNION ALL
SELECT 
	'Building' AS property_type,
  property_type_id,
	id,
	classification_id,
	pid,
	pin,
	agency_id,
	address1,
	administrative_area_id,
	is_sensitive,
	updated_on,
	NULL AS land_area
FROM building b
WHERE deleted_on IS NULL)
SELECT 
	property.*, 
	agc."name" AS agency_name,
	aa."name" AS administrative_area_name,
	pc."name" AS property_classification_name
FROM property 
	LEFT JOIN agency agc ON property.agency_id = agc.id
	LEFT JOIN administrative_area aa ON property.administrative_area_id = aa.id
	LEFT JOIN property_classification pc ON property.classification_id = pc.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'property_union',
        'WITH property AS (SELECT \n\t\'Parcel\' AS property_type,\n  property_type_id,\n\tid,\n\tclassification_id,\n\tpid,\n\tpin,\n\tagency_id,\n\taddress1,\n\tadministrative_area_id,\n\tis_sensitive,\n\tupdated_on,\n\tland_area\nFROM parcel p\nWHERE deleted_on IS NULL\nUNION ALL\nSELECT \n\t\'Building\' AS property_type,\n  property_type_id,\n\tid,\n\tclassification_id,\n\tpid,\n\tpin,\n\tagency_id,\n\taddress1,\n\tadministrative_area_id,\n\tis_sensitive,\n\tupdated_on,\n\tNULL AS land_area\nFROM building b\nWHERE deleted_on IS NULL)\nSELECT \n\tproperty.*, \n\tagc."name" AS agency_name,\n\taa."name" AS administrative_area_name,\n\tpc."name" AS property_classification_name\nFROM property \n\tLEFT JOIN agency agc ON property.agency_id = agc.id\n\tLEFT JOIN administrative_area aa ON property.administrative_area_id = aa.id\n\tLEFT JOIN property_classification pc ON property.classification_id = pc.id;',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'property_union', 'public'],
    );
    await queryRunner.query(`DROP VIEW "property_union"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'map_properties', 'public'],
    );
    await queryRunner.query(`DROP VIEW "map_properties"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'building_relations', 'public'],
    );
    await queryRunner.query(`DROP VIEW "building_relations"`);
    await queryRunner.query(`CREATE MATERIALIZED VIEW "building_relations" AS SELECT b.id AS "building_id", b.pid, b.pin, p.id as "parcel_id"
    FROM building b
    LEFT OUTER JOIN parcel p
    ON b.pid = p.pid OR b.pin = p.pin;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'building_relations',
        'SELECT b.id AS "building_id", b.pid, b.pin, p.id as "parcel_id"\n    FROM building b\n    LEFT OUTER JOIN parcel p\n    ON b.pid = p.pid OR b.pin = p.pin;',
      ],
    );
    await queryRunner.query(`CREATE VIEW "map_properties" AS SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.is_visible_to_other_agencies, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id
    FROM (
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name 
      FROM parcel
      UNION ALL
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name 
      FROM building
    ) c
    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'map_properties',
        'SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.is_visible_to_other_agencies, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id\n    FROM (\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name \n      FROM parcel\n      UNION ALL\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name \n      FROM building\n    ) c\n    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;',
      ],
    );
    await queryRunner.query(`CREATE VIEW "property_union" AS WITH property AS (SELECT 
	'Parcel' AS property_type,
  property_type_id,
	id,
	classification_id,
	pid,
	pin,
	agency_id,
	address1,
	administrative_area_id,
	is_sensitive,
	updated_on,
	land_area
FROM parcel p
UNION ALL
SELECT 
	'Building' AS property_type,
  property_type_id,
	id,
	classification_id,
	pid,
	pin,
	agency_id,
	address1,
	administrative_area_id,
	is_sensitive,
	updated_on,
	NULL AS land_area
FROM building b)
SELECT 
	property.*, 
	agc."name" AS agency_name,
	aa."name" AS administrative_area_name,
	pc."name" AS property_classification_name
FROM property 
	LEFT JOIN agency agc ON property.agency_id = agc.id
	LEFT JOIN administrative_area aa ON property.administrative_area_id = aa.id
	LEFT JOIN property_classification pc ON property.classification_id = pc.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'property_union',
        'WITH property AS (SELECT \n\t\'Parcel\' AS property_type,\n  property_type_id,\n\tid,\n\tclassification_id,\n\tpid,\n\tpin,\n\tagency_id,\n\taddress1,\n\tadministrative_area_id,\n\tis_sensitive,\n\tupdated_on,\n\tland_area\nFROM parcel p\nUNION ALL\nSELECT \n\t\'Building\' AS property_type,\n  property_type_id,\n\tid,\n\tclassification_id,\n\tpid,\n\tpin,\n\tagency_id,\n\taddress1,\n\tadministrative_area_id,\n\tis_sensitive,\n\tupdated_on,\n\tNULL AS land_area\nFROM building b)\nSELECT \n\tproperty.*, \n\tagc."name" AS agency_name,\n\taa."name" AS administrative_area_name,\n\tpc."name" AS property_classification_name\nFROM property \n\tLEFT JOIN agency agc ON property.agency_id = agc.id\n\tLEFT JOIN administrative_area aa ON property.administrative_area_id = aa.id\n\tLEFT JOIN property_classification pc ON property.classification_id = pc.id;',
      ],
    );
  }
}
