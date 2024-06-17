import { MigrationInterface, QueryRunner } from 'typeorm';

export class PropertyUnionView1718405843734 implements MigrationInterface {
  name = 'PropertyUnionView1718405843734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW "property_union" AS WITH property AS (SELECT 
	'Parcel' AS property_type,
	id,
	classification_id,
	pid,
	pin,
	agency_id,
	address1,
	administrative_area_id,
	is_sensitive,
	updated_on
FROM parcel p
UNION ALL
SELECT 
	'Building' AS property_type,
	id,
	classification_id,
	pid,
	pin,
	agency_id,
	address1,
	administrative_area_id,
	is_sensitive,
	updated_on
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
        'WITH property AS (SELECT \n\t\'Parcel\' AS property_type,\n\tid,\n\tclassification_id,\n\tpid,\n\tpin,\n\tagency_id,\n\taddress1,\n\tadministrative_area_id,\n\tis_sensitive,\n\tupdated_on\nFROM parcel p\nUNION ALL\nSELECT \n\t\'Building\' AS property_type,\n\tid,\n\tclassification_id,\n\tpid,\n\tpin,\n\tagency_id,\n\taddress1,\n\tadministrative_area_id,\n\tis_sensitive,\n\tupdated_on\nFROM building b)\nSELECT \n\tproperty.*, \n\tagc."name" AS agency_name,\n\taa."name" AS administrative_area_name,\n\tpc."name" AS property_classification_name\nFROM property \n\tLEFT JOIN agency agc ON property.agency_id = agc.id\n\tLEFT JOIN administrative_area aa ON property.administrative_area_id = aa.id\n\tLEFT JOIN property_classification pc ON property.classification_id = pc.id;',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'property_union', 'public'],
    );
    await queryRunner.query(`DROP VIEW "property_union"`);
  }
}
