import { BuildingConstructionTypes } from '@/typeorm/Entities/BuildingConstructionTypes';
import { BuildingOccupantTypes } from '@/typeorm/Entities/BuildingOccupantTypes';
import { BuildingPredominateUses } from '@/typeorm/Entities/BuildingPredominateUses';
import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Property } from '@/typeorm/Entities/abstractEntities/Property';

// Should the occupant information (OccupantTypeId, OccupantName, and BuildingTenancyUpdatedOn) be a separate table?
// This may change over time and we wouldn't be able to track previous occupants by storing it in this table.

// Can Buildings and Parcels share a base Properties entity?
@Entity()
export class Buildings extends Property {
  @ManyToOne(() => BuildingConstructionTypes, (constructionType) => constructionType.Id)
  @JoinColumn({ name: 'BuildingConstructionTypeId' })
  @Index()
  BuildingConstructionTypeId: BuildingConstructionTypes;

  @Column({ type: 'int' })
  BuildingFloorCount: number;

  @ManyToOne(() => BuildingPredominateUses, (predominateUse) => predominateUse.Id)
  @JoinColumn({ name: 'BuildingPredominateUseId' })
  @Index()
  BuildingPredominateUseId: BuildingPredominateUses;

  @Column({ type: 'character varying', length: 450 })
  BuildingTenancy: string;

  @Column({ type: 'real' })
  RentableArea: number;

  @ManyToOne(() => BuildingOccupantTypes, (occupantType) => occupantType.Id)
  @JoinColumn({ name: 'BuildingOccupantTypeId' })
  @Index()
  BuildingOccupantTypeId: BuildingOccupantTypes;

  @Column({ type: 'timestamp', nullable: true })
  LeaseExpiry: Date;

  @Column({ type: 'character varying', length: 100, nullable: true })
  OccupantName: string;

  @Column({ type: 'bit' })
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
