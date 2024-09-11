import { GeoPoint } from '@/typeorm/Entities/abstractEntities/Property';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `
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
  `,
})
export class MapProperties {
  @ViewColumn({ name: 'id' })
  Id: number;

  @ViewColumn({ name: 'pid' })
  PID: number;

  @ViewColumn({ name: 'pin' })
  PIN: number;

  @ViewColumn({ name: 'location' })
  Location: GeoPoint;

  @ViewColumn({ name: 'property_type_id' })
  PropertyTypeId: number;

  @ViewColumn({ name: 'address1' })
  Address1: string;

  @ViewColumn({ name: 'classification_id' })
  ClassificationId: number;

  @ViewColumn({ name: 'agency_id' })
  AgencyId: number;

  @ViewColumn({ name: 'administrative_area_id' })
  AdministrativeAreaId: number;

  @ViewColumn({ name: 'name' })
  Name: string;

  @ViewColumn({ name: 'regional_district_id' })
  RegionalDistrictId: number;

  @ViewColumn({ name: 'project_status_id' })
  ProjectStatusId: number;
}
