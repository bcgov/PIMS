import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectViewFix1721057925806 implements MigrationInterface {
  name = 'ProjectViewFix1721057925806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'project_join', 'public'],
    );
    await queryRunner.query(`DROP VIEW "project_join"`);
    await queryRunner.query(`CREATE VIEW "project_join" AS 
    SELECT
			p.id,
			p.project_number,
			p.name,
			p.status_id,
			p.agency_id,
			p.market,
			p.net_book,
			ps."name" AS status_name,
			agc."name" AS agency_name,
			u.first_name AS user_first_name,
			u.last_name AS user_last_name,
			u.last_name || ', ' || u.first_name AS user_full_name,
			p.updated_on 
		FROM
			project p
		LEFT JOIN agency agc ON
			p.agency_id = agc.id
		LEFT JOIN project_status ps ON
			p.status_id = ps.id
		LEFT JOIN "user" u ON 
			p.updated_by_id = u.id
		WHERE p.deleted_on IS NULL;
    `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'project_join',
        'SELECT\n\tp.id,\n\tp.project_number,\n\tp.name,\n\tp.status_id,\n\tp.agency_id,\n\tp.market,\n\tp.net_book,\n\tps."name" AS status_name,\n\tagc."name" AS agency_name,\n\tu.first_name AS user_first_name,\n\tu.last_name AS user_last_name,\n\tu.last_name || \', \' || u.first_name AS user_full_name,\n\tp.updated_on \nFROM\n\tproject p\nLEFT JOIN agency agc ON\n\tp.agency_id = agc.id\nLEFT JOIN project_status ps ON\n\tp.status_id = ps.id\nLEFT JOIN "user" u ON \n\tp.updated_by_id = u.id\nWHERE p.deleted_on IS NULL;',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'project_join', 'public'],
    );
    await queryRunner.query(`DROP VIEW "project_join"`);
    await queryRunner.query(`CREATE VIEW "project_join" AS SELECT
			p.id,
			p.project_number,
			p.name,
			p.status_id,
			p.agency_id,
			p.market,
			p.net_book,
			ps."name" AS status_name,
			agc."name" AS agency_name,
			u.first_name AS user_first_name,
			u.last_name AS user_last_name,
			u.last_name || ', ' || u.first_name AS user_full_name,
			ps.updated_on 
		FROM
			project p
		LEFT JOIN agency agc ON
			p.agency_id = agc.id
		LEFT JOIN project_status ps ON
			p.status_id = ps.id
		LEFT JOIN "user" u ON 
			p.updated_by_id = u.id
		WHERE p.deleted_on IS NULL;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'project_join',
        'SELECT\n\tp.id,\n\tp.project_number,\n\tp.name,\n\tp.status_id,\n\tp.agency_id,\n\tp.market,\n\tp.net_book,\n\tps."name" AS status_name,\n\tagc."name" AS agency_name,\n\tu.first_name AS user_first_name,\n\tu.last_name AS user_last_name,\n\tu.last_name || \', \' || u.first_name AS user_full_name,\n\tps.updated_on \nFROM\n\tproject p\nLEFT JOIN agency agc ON\n\tp.agency_id = agc.id\nLEFT JOIN project_status ps ON\n\tp.status_id = ps.id\nLEFT JOIN "user" u ON \n\tp.updated_by_id = u.id\nWHERE p.deleted_on IS NULL;',
      ],
    );
  }
}
