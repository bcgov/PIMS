import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUnusedColumns1724341960306 implements MigrationInterface {
  name = 'DropUnusedColumns1724341960306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'map_properties', 'public'],
    );
    await queryRunner.query(`DROP VIEW "map_properties"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_153314ab22e3d8bac6c328ec5c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_verified"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_system"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "site_id"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "lease_expiry"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "occupant_name"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "encumbrance_reason"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "leased_land_metadata"`);
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "is_visible_to_other_agencies"`);
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "site_id"`);
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "zoning"`);
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "zoning_potential"`);
    await queryRunner.query(`ALTER TABLE "parcel" DROP COLUMN "is_visible_to_other_agencies"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "metadata"`);
    await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    await queryRunner.query(`CREATE VIEW "map_properties" AS 
      SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id
      FROM (
        SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name 
        FROM parcel WHERE deleted_on IS NULL
        UNION ALL
        SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name 
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
        'SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id\n    FROM (\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name \n      FROM parcel WHERE deleted_on IS NULL\n      UNION ALL\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name \n      FROM building WHERE deleted_on IS NULL\n    ) c\n    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'map_properties', 'public'],
    );
    await queryRunner.query(`DROP VIEW "map_properties"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`ALTER TABLE "project" ADD "metadata" jsonb`);
    await queryRunner.query(`ALTER TABLE "parcel" ADD "zoning_potential" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "parcel" ADD "zoning" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "parcel" ADD "site_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD "is_visible_to_other_agencies" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "building" ADD "leased_land_metadata" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "building" ADD "encumbrance_reason" character varying(500)`,
    );
    await queryRunner.query(`ALTER TABLE "building" ADD "occupant_name" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "building" ADD "lease_expiry" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "building" ADD "site_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "building" ADD "is_visible_to_other_agencies" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "is_system" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email_verified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_153314ab22e3d8bac6c328ec5c" ON "user" ("keycloak_user_id") `,
    );
    await queryRunner.query(`CREATE VIEW "map_properties" AS SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.is_visible_to_other_agencies, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id
      FROM (
        SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name 
        FROM parcel WHERE deleted_on IS NULL
        UNION ALL
        SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name 
        FROM building WHERE deleted_on IS NULL
      ) c
      LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'map_properties',
        'SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.is_visible_to_other_agencies, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id\n    FROM (\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name \n      FROM parcel WHERE deleted_on IS NULL\n      UNION ALL\n      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name \n      FROM building WHERE deleted_on IS NULL\n    ) c\n    LEFT JOIN administrative_area aa ON c.administrative_area_id = aa.id;',
      ],
    );
  }
}
