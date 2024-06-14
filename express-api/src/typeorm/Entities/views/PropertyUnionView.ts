import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `WITH property AS (SELECT 
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
	LEFT JOIN property_classification pc ON property.classification_id = pc.id;`,
})
export class PropertyUnion {
  @ViewColumn({ name: 'id' })
  Id: number;

  @ViewColumn({ name: 'pid' })
  PID: number;

  @ViewColumn({ name: 'pin' })
  PIN: number;

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
}
