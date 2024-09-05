import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `WITH property AS (SELECT 
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
	LEFT JOIN property_classification pc ON property.classification_id = pc.id;`,
})
export class PropertyUnion {
  @ViewColumn({ name: 'id' })
  Id: number;

  @ViewColumn({ name: 'pid' })
  PID: number;

  @ViewColumn({ name: 'pin' })
  PIN: number;

  @ViewColumn({ name: 'property_type_id' })
  PropertyTypeId: number;

  @ViewColumn({ name: 'property_type' })
  PropertyType: string;

  @ViewColumn({ name: 'agency_id' })
  AgencyId: number;

  @ViewColumn({ name: 'agency_name' })
  Agency: string;

  @ViewColumn({ name: 'address1' })
  Address: string;

  @ViewColumn({ name: 'is_sensitive' })
  IsSensitive: boolean;

  @ViewColumn({ name: 'updated_on' })
  UpdatedOn: Date;

  @ViewColumn({ name: 'classification_id' })
  ClassificationId: number;

  @ViewColumn({ name: 'property_classification_name' })
  Classification: string;

  @ViewColumn({ name: 'administrative_area_id' })
  AdministrativeAreaId: number;

  @ViewColumn({ name: 'administrative_area_name' })
  AdministrativeArea: string;

  @ViewColumn({ name: 'land_area' })
  LandArea: number;

  @ViewColumn({ name: 'project_status_id' })
  ProjectStatusId: number;
}
