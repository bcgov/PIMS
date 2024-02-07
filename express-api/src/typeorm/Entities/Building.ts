import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import { BuildingOccupantType } from '@/typeorm/Entities/BuildingOccupantType';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Property } from '@/typeorm/Entities/abstractEntities/Property';

// Should the occupant information (OccupantTypeId, OccupantName, and BuildingTenancyUpdatedOn) be a separate table?
// This may change over time and we wouldn't be able to track previous occupants by storing it in this table.

// Can Buildings and Parcels share a base Properties entity?
@Entity()
export class Building extends Property {
  @ManyToOne(() => BuildingConstructionType, (ConstructionType) => ConstructionType.Id)
  @JoinColumn({ name: 'BuildingConstructionTypeId' })
  @Index()
  BuildingConstructionTypeId: BuildingConstructionType;

  @Column({ type: 'int' })
  BuildingFloorCount: number;

  @ManyToOne(() => BuildingPredominateUse, (PredominateUse) => PredominateUse.Id)
  @JoinColumn({ name: 'BuildingPredominateUseId' })
  @Index()
  BuildingPredominateUseId: BuildingPredominateUse;

  @Column({ type: 'character varying', length: 450 })
  BuildingTenancy: string;

  @Column({ type: 'real' })
  RentableArea: number;

  @ManyToOne(() => BuildingOccupantType, (OccupantType) => OccupantType.Id)
  @JoinColumn({ name: 'BuildingOccupantTypeId' })
  @Index()
  BuildingOccupantTypeId: BuildingOccupantType;

  @Column({ type: 'timestamp', nullable: true })
  LeaseExpiry: Date;

  @Column({ type: 'character varying', length: 100, nullable: true })
  OccupantName: string;

  @Column({ type: 'boolean' })
  TransferLeaseOnSale: boolean;

  @Column({ type: 'timestamp', nullable: true })
  BuildingTenancyUpdatedOn: Date;

  @Column({ type: 'character varying', length: 500, nullable: true })
  EncumbranceReason: string;

  // What is this column used for?
  @Column({ type: 'character varying', length: 2000, nullable: true })
  LeasedLandMetadata: string;

  @Column({ type: 'real' })
  TotalArea: number;
}
