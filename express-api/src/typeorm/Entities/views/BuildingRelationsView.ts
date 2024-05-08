import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: false,
  expression: `
    SELECT b.id AS "building_id", b.pid, b.pin, p.id as "parcel_id"
    FROM building b
    LEFT OUTER JOIN parcel p
    ON b.pid = p.pid OR b.pin = p.pin;
  `,
})
export class BuildingRelations {
  @ViewColumn({ name: 'building_id' })
  BuildingId: number;

  @ViewColumn({ name: 'parcel_id' })
  ParcelId: number;

  @ViewColumn({ name: 'pid' })
  PID: number;

  @ViewColumn({ name: 'pin' })
  PIN: number;
}
