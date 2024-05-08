import { GeoPoint } from '@/typeorm/Entities/abstractEntities/Property';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `
  (SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name FROM parcel)
  UNION ALL
  (SELECT id, pid, pin, location, property_type_id, address1, classification_id, agency_id, is_visible_to_other_agencies, administrative_area_id, name FROM building);
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

  @ViewColumn({ name: 'is_visible_to_other_agencies' })
  IsVisibleToOtherAgencies: boolean;

  @ViewColumn({ name: 'administrative_area_id' })
  AdministrativeAreaId: number;

  @ViewColumn({ name: 'name' })
  Name: string;
}
