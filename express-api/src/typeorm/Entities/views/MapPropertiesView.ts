import { GeoPoint } from '@/typeorm/Entities/abstractEntities/Property';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `
    SELECT c.id, c.pid, c.pin, c.location, c.property_type_id, c.address1, c.classification_id, c.agency_id, c.administrative_area_id, c.name, aa.regional_district_id as regional_district_id
    FROM (
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name 
      FROM parcel WHERE deleted_on IS NULL
      UNION ALL
      SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, administrative_area_id, name 
      FROM building WHERE deleted_on IS NULL
    ) c
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
}
