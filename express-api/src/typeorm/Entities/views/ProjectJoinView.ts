import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `
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
	ps.updated_on 
FROM
	project p
LEFT JOIN agency agc ON
	p.agency_id = agc.id
LEFT JOIN project_status ps ON
	p.status_id = ps.id
LEFT JOIN "user" u ON 
	p.updated_by_id = u.id;
    `,
})
export class ProjectJoin {
  @ViewColumn({ name: 'id' })
  Id: number;

  @ViewColumn({ name: 'project_number' })
  ProjectNumber: string;

  @ViewColumn({ name: 'name' })
  Name: string;

  @ViewColumn({ name: 'status_id' })
  StatusId: number;

  @ViewColumn({ name: 'agency_id' })
  AgencyId: number;

  @ViewColumn({ name: 'agency_name' })
  Agency: string;

  @ViewColumn({ name: 'status_name' })
  Status: string;

  @ViewColumn({ name: 'market' })
  Market: string;

  @ViewColumn({ name: 'net_book' })
  NetBook: string;

  @ViewColumn({ name: 'user_full_name' })
  UpdatedBy: string;

  @ViewColumn({ name: 'updated_on' })
  UpdatedOn: Date;
}
