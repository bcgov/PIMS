import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoreTableViews1720641729780 implements MigrationInterface {
  name = 'MoreTableViews1720641729780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW "administrative_area_join_view" AS 
  SELECT a.created_on,
    a.id,
    a.name,
    a.is_disabled,
    a.sort_order,
    a.regional_district_id,
    rd.name as "regional_district_name",
    a.province_id
  FROM administrative_area a
  LEFT JOIN regional_district rd ON a.regional_district_id = rd.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'administrative_area_join_view',
        'SELECT a.created_on,\n    a.id,\n    a.name,\n    a.is_disabled,\n    a.sort_order,\n    a.regional_district_id,\n    rd.name as "regional_district_name",\n    a.province_id\n  FROM administrative_area a\n  LEFT JOIN regional_district rd ON a.regional_district_id = rd.id;',
      ],
    );
    await queryRunner.query(`CREATE VIEW "agency_join_view" AS 
  SELECT a.id,
    a.name,
    a.code,
    a.description,
    a.is_disabled,
    a.sort_order,
    a.parent_id,
    pa.name AS "parent_name",
    a.email,
    a.send_email,
    a.created_on,
    a.updated_on
  FROM agency a
  LEFT JOIN agency pa ON a.parent_id = pa.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'agency_join_view',
        'SELECT a.id,\n    a.name,\n    a.code,\n    a.description,\n    a.is_disabled,\n    a.sort_order,\n    a.parent_id,\n    pa.name AS "parent_name",\n    a.email,\n    a.send_email,\n    a.created_on,\n    a.updated_on\n  FROM agency a\n  LEFT JOIN agency pa ON a.parent_id = pa.id;',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'agency_join_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "agency_join_view"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'administrative_area_join_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "administrative_area_join_view"`);
  }
}
