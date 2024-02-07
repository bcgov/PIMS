import {
  Entity,
  Index,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { BaseEntity } from './abstractEntities/BaseEntity';
import { User } from './User_Role_Claim';

@Entity()
@Index(['ParentId', 'IsDisabled', 'Id', 'Name', 'SortOrder']) // I'm not sure this index is needed. How often do we search by this group?
export class Agency extends BaseEntity {
  @PrimaryColumn({ type: 'int' })
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column({ type: 'boolean' })
  IsDisabled: boolean;

  @Column({ type: 'int' })
  SortOrder: number;

  @Column({ type: 'character varying', length: 6 })
  Code: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Description: string;

  @ManyToOne(() => Agency, (agency) => agency.Id)
  @JoinColumn({ name: 'ParentId' })
  @Index()
  ParentId: Agency;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Email: string;

  @Column({ type: 'boolean' })
  SendEmail: boolean;

  @Column({ type: 'character varying', length: 100, nullable: true })
  AddressTo: string;

  @Column({ type: 'character varying', length: 250, nullable: true })
  CCEmail: string;

  @OneToMany(() => User, (user) => user.AgencyId)
  User: Relation<User>[];
}
