import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `
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
  LEFT JOIN agency pa ON a.parent_id = pa.id;`,
})
export class AgencyJoinView {
  @ViewColumn({ name: 'id' })
  Id: number;

  @ViewColumn({ name: 'name' })
  Name: string;

  @ViewColumn({ name: 'code' })
  Code: string;

  @ViewColumn({ name: 'description' })
  Description: string;

  @ViewColumn({ name: 'is_disabled' })
  IsDisabled: boolean;

  @ViewColumn({ name: 'sort_order' })
  SortOrder: number;

  @ViewColumn({ name: 'parent_id' })
  ParentId: number;

  @ViewColumn({ name: 'parent_name' })
  ParentName: string;

  @ViewColumn({ name: 'email' })
  Email: string;

  @ViewColumn({ name: 'send_email' })
  SendEmail: boolean;

  @ViewColumn({ name: 'created_on' })
  CreatedOn: Date;

  @ViewColumn({ name: 'updated_on' })
  UpdatedOn: Date;
}
