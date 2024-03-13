import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBuildingRelationsView1710191053571 implements MigrationInterface {
  name = 'AddBuildingRelationsView1710191053571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE MATERIALIZED VIEW "building_relations" AS 
    SELECT b.id AS "building_id", b.pid, b.pin, p.id as "parcel_id"
    FROM building b
    LEFT OUTER JOIN parcel p
    ON b.pid = p.pid OR b.pin = p.pin;
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'building_relations',
        'SELECT b.id AS "building_id", b.pid, b.pin, p.id as "parcel_id"\n    FROM building b\n    LEFT OUTER JOIN parcel p\n    ON b.pid = p.pid OR b.pin = p.pin;',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'building_relations', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "building_relations"`);
  }
}
