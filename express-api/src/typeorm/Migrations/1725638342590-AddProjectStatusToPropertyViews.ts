import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectStatusToPropertyViews1725638342590 implements MigrationInterface {
  name = 'AddProjectStatusToPropertyViews1725638342590';

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
    await queryRunner.query(`CREATE VIEW "map_properties" AS 
    SELECT c.id,
        c.pid,
        c.pin,
        c.location,
        c.property_type_id,
        c.address1,
        c.classification_id,
        c.agency_id,
        c.administrative_area_id,
        c.name,
        aa.regional_district_id as regional_district_id,
        c.project_status_id
    FROM
    (SELECT p.id,
            p.pid,
            p.pin,
            p.location,
            p.property_type_id,
            p.address1,
            p.classification_id,
            p.agency_id,
            p.administrative_area_id,
            p.name,
            proj.status_id as project_status_id
      FROM parcel p
      LEFT JOIN
          (SELECT pp.parcel_id,
                  pp.id,
                  pp.project_id
          FROM project_property pp
          INNER JOIN
              (SELECT parcel_id,
                      MAX(updated_on) AS max_updated_on
                FROM project_property
                GROUP BY parcel_id) pp_max ON pp.parcel_id = pp_max.parcel_id
          AND pp.updated_on = pp_max.max_updated_on) pp_recent ON p.id = pp_recent.parcel_id
      LEFT JOIN project proj ON proj.id = pp_recent.project_id
      WHERE p.deleted_on IS NULL
      UNION ALL SELECT b.id,
                      b.pid,
                      b.pin,
                      b.location,
                      b.property_type_id,
                      b.address1,
                      b.classification_id,
                      b.agency_id,
                      b.administrative_area_id,
                      b.name,
                      proj.status_id as project_status_id
      FROM building b
      LEFT JOIN
          (SELECT pp.building_id,
                  pp.id,
                  pp.project_id
          FROM project_property pp
          INNER JOIN
              (SELECT building_id,
                      MAX(updated_on) AS max_updated_on
                FROM project_property
                GROUP BY building_id) pp_max ON pp.building_id = pp_max.building_id
          AND pp.updated_on = pp_max.max_updated_on) pp_recent ON b.id = pp_recent.building_id
      LEFT JOIN project proj ON proj.id = pp_recent.project_id
      WHERE b.deleted_on IS NULL ) c
    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id; 
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'map_properties',
        'SELECT c.id,\n        c.pid,\n        c.pin,\n        c.location,\n        c.property_type_id,\n        c.address1,\n        c.classification_id,\n        c.agency_id,\n        c.administrative_area_id,\n        c.name,\n        aa.regional_district_id as regional_district_id,\n        c.project_status_id\n    FROM\n    (SELECT p.id,\n            p.pid,\n            p.pin,\n            p.location,\n            p.property_type_id,\n            p.address1,\n            p.classification_id,\n            p.agency_id,\n            p.administrative_area_id,\n            p.name,\n            proj.status_id as project_status_id\n      FROM parcel p\n      LEFT JOIN\n          (SELECT pp.parcel_id,\n                  pp.id,\n                  pp.project_id\n          FROM project_property pp\n          INNER JOIN\n              (SELECT parcel_id,\n                      MAX(updated_on) AS max_updated_on\n                FROM project_property\n                GROUP BY parcel_id) pp_max ON pp.parcel_id = pp_max.parcel_id\n          AND pp.updated_on = pp_max.max_updated_on) pp_recent ON p.id = pp_recent.parcel_id\n      LEFT JOIN project proj ON proj.id = pp_recent.project_id\n      WHERE p.deleted_on IS NULL\n      UNION ALL SELECT b.id,\n                      b.pid,\n                      b.pin,\n                      b.location,\n                      b.property_type_id,\n                      b.address1,\n                      b.classification_id,\n                      b.agency_id,\n                      b.administrative_area_id,\n                      b.name,\n                      proj.status_id as project_status_id\n      FROM building b\n      LEFT JOIN\n          (SELECT pp.building_id,\n                  pp.id,\n                  pp.project_id\n          FROM project_property pp\n          INNER JOIN\n              (SELECT building_id,\n                      MAX(updated_on) AS max_updated_on\n                FROM project_property\n                GROUP BY building_id) pp_max ON pp.building_id = pp_max.building_id\n          AND pp.updated_on = pp_max.max_updated_on) pp_recent ON b.id = pp_recent.building_id\n      LEFT JOIN project proj ON proj.id = pp_recent.project_id\n      WHERE b.deleted_on IS NULL ) c\n    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;',
      ],
    );
    await queryRunner.query(`CREATE VIEW "property_union" AS WITH property AS (SELECT 
	'Parcel' AS property_type,
  p.property_type_id,
	p.id,
	p.classification_id,
	p.pid,
	p.pin,
	p.agency_id,
	p.address1,
	p.administrative_area_id,
	p.is_sensitive,
	p.updated_on,
	p.land_area,
  proj.status_id AS project_status_id
FROM parcel p
LEFT JOIN (
    SELECT
        pp.parcel_id,
        pp.id,
        pp.project_id
    FROM
        project_property pp
    INNER JOIN (
        SELECT
            parcel_id,
            MAX(updated_on) AS max_updated_on
        FROM
            project_property
        GROUP BY
            parcel_id
    ) pp_max ON pp.parcel_id = pp_max.parcel_id
              AND pp.updated_on = pp_max.max_updated_on
) pp_recent ON p.id = pp_recent.parcel_id
LEFT JOIN project proj ON proj.id = pp_recent.project_id
WHERE p.deleted_on IS NULL
UNION ALL
SELECT 
	'Building' AS property_type,
  b.property_type_id,
	b.id,
	b.classification_id,
	b.pid,
	b.pin,
	b.agency_id,
	b.address1,
	b.administrative_area_id,
	b.is_sensitive,
	b.updated_on,
	NULL AS land_area,
  proj.status_id AS project_status_id
FROM building b
LEFT JOIN (
    SELECT
        pp.building_id,
        pp.id,
        pp.project_id
    FROM
        project_property pp
    INNER JOIN (
        SELECT
            building_id,
            MAX(updated_on) AS max_updated_on
        FROM
            project_property
        GROUP BY
            building_id
    ) pp_max ON pp.building_id = pp_max.building_id
              AND pp.updated_on = pp_max.max_updated_on
) pp_recent ON b.id = pp_recent.building_id
LEFT JOIN project proj ON proj.id = pp_recent.project_id
WHERE b.deleted_on IS NULL)
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
        'WITH property AS (SELECT \n\t\'Parcel\' AS property_type,\n  p.property_type_id,\n\tp.id,\n\tp.classification_id,\n\tp.pid,\n\tp.pin,\n\tp.agency_id,\n\tp.address1,\n\tp.administrative_area_id,\n\tp.is_sensitive,\n\tp.updated_on,\n\tp.land_area,\n  proj.status_id AS project_status_id\nFROM parcel p\nLEFT JOIN (\n    SELECT\n        pp.parcel_id,\n        pp.id,\n        pp.project_id\n    FROM\n        project_property pp\n    INNER JOIN (\n        SELECT\n            parcel_id,\n            MAX(updated_on) AS max_updated_on\n        FROM\n            project_property\n        GROUP BY\n            parcel_id\n    ) pp_max ON pp.parcel_id = pp_max.parcel_id\n              AND pp.updated_on = pp_max.max_updated_on\n) pp_recent ON p.id = pp_recent.parcel_id\nLEFT JOIN project proj ON proj.id = pp_recent.project_id\nWHERE p.deleted_on IS NULL\nUNION ALL\nSELECT \n\t\'Building\' AS property_type,\n  b.property_type_id,\n\tb.id,\n\tb.classification_id,\n\tb.pid,\n\tb.pin,\n\tb.agency_id,\n\tb.address1,\n\tb.administrative_area_id,\n\tb.is_sensitive,\n\tb.updated_on,\n\tNULL AS land_area,\n  proj.status_id AS project_status_id\nFROM building b\nLEFT JOIN (\n    SELECT\n        pp.building_id,\n        pp.id,\n        pp.project_id\n    FROM\n        project_property pp\n    INNER JOIN (\n        SELECT\n            building_id,\n            MAX(updated_on) AS max_updated_on\n        FROM\n            project_property\n        GROUP BY\n            building_id\n    ) pp_max ON pp.building_id = pp_max.building_id\n              AND pp.updated_on = pp_max.max_updated_on\n) pp_recent ON b.id = pp_recent.building_id\nLEFT JOIN project proj ON proj.id = pp_recent.project_id\nWHERE b.deleted_on IS NULL)\nSELECT \n\tproperty.*, \n\tagc."name" AS agency_name,\n\taa."name" AS administrative_area_name,\n\tpc."name" AS property_classification_name\nFROM property \n\tLEFT JOIN agency agc ON property.agency_id = agc.id\n\tLEFT JOIN administrative_area aa ON property.administrative_area_id = aa.id\n\tLEFT JOIN property_classification pc ON property.classification_id = pc.id;',
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
    await queryRunner.query(`CREATE VIEW "map_properties" AS SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id
    FROM (
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name 
      FROM parcel WHERE deleted_on IS NULL
      UNION ALL
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name 
      FROM building WHERE deleted_on IS NULL
    ) c
    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'map_properties',
        'SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id\n    FROM (\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name \n      FROM parcel WHERE deleted_on IS NULL\n      UNION ALL\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name \n      FROM building WHERE deleted_on IS NULL\n    ) c\n    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;',
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
}
