import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `
  SELECT a.created_on,
    a.id,
    a.name,
    a.is_disabled,
    a.sort_order,
    a.regional_district_id,
    rd.name as "regional_district_name",
    a.province_id
  FROM administrative_area a
  LEFT JOIN regional_district rd ON a.regional_district_id = rd.id;`,
})
export class AdministrativeAreaJoinView {
  @ViewColumn({ name: 'id' })
  Id: number;

  @ViewColumn({ name: 'name' })
  Name: string;

  @ViewColumn({ name: 'is_disabled' })
  IsDisabled: boolean;

  @ViewColumn({ name: 'sort_order' })
  SortOrder: number;

  @ViewColumn({ name: 'regional_district_id' })
  RegionalDistrictId: number;

  @ViewColumn({ name: 'regional_district_name' })
  RegionalDistrictName: string;

  @ViewColumn({ name: 'province_id' })
  ProvinceId: string;

  @ViewColumn({ name: 'created_on' })
  CreatedOn: Date;
}
