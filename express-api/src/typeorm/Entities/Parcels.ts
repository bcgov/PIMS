import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Property } from '@/typeorm/Entities/abstractEntities/Property';
import { Buildings } from '@/typeorm/Entities/Buildings';

@Entity()
@Index(['PID', 'PIN'], { unique: true })
export class Parcels extends Property {
  @Column({ type: 'int' })
  PID: number;

  @Column({ type: 'int', nullable: true })
  PIN: number;

  @Column({ type: 'real', nullable: true })
  LandArea: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  LandLegalDescription: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  Zoning: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  ZoningPotential: string;

  @Column({ type: 'bit' })
  NotOwned: boolean;

  @ManyToOne(() => Parcels, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParentParcel' })
  @Index()
  ParentParcel: Parcels;

  @ManyToMany(() => Buildings, () => Parcels, { cascade: ['insert', 'update'], nullable: true })
  @JoinTable({
    name: 'parcel_buildings',
    joinColumn: {
      name: 'ParcelId',
    },
    inverseJoinColumn: {
      referencedColumnName: 'Id',
      name: 'BuildingId',
    },
  })
  Buildings: Buildings[];
}
