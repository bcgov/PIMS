import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  PrimaryColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import type { Users } from './Users';

@Entity()
@Index(['ParentId', 'IsDisabled', 'Id', 'Name', 'SortOrder']) // I'm not sure this index is needed. How often do we search by this group?
export class Agencies extends BaseEntity {
  @PrimaryColumn({ type: 'character varying', length: 6 })
  Id: string;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column({ type: 'bit' })
  IsDisabled: boolean;

  @Column({ type: 'int' })
  SortOrder: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Description: string;

  @ManyToOne(() => Agencies, (agency) => agency.Id)
  @JoinColumn({ name: 'ParentId' })
  @Index()
  ParentId: Agencies;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Email: string;

  @Column({ type: 'bit' })
  SendEmail: boolean;

  @Column({ type: 'character varying', length: 100, nullable: true })
  AddressTo: string;

  @Column({ type: 'character varying', length: 250, nullable: true })
  CCEmail: string;

  @ManyToMany('Users', 'Agencies')
  @JoinTable({
    name: 'user_agencies',
    joinColumn: {
      name: 'AgencyId',
    },
    inverseJoinColumn: {
      referencedColumnName: 'Id',
      name: 'UserId',
    },
  })
  Agencies: Users[];
}
