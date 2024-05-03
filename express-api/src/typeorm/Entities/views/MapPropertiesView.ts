import { GeoPoint } from '@/typeorm/Entities/abstractEntities/Property';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `
  (SELECT id, pid, pin, location, property_type_id FROM parcel)
  UNION ALL
  (SELECT id, pid, pin, location, property_type_id FROM building);
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
}
