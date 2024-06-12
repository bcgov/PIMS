import {
  Entity,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { User } from '@/typeorm/Entities/User';

@Entity()
@Index(['ParentId', 'IsDisabled', 'Id', 'Name', 'SortOrder']) // I'm not sure this index is needed. How often do we search by this group?
export class Agency extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column({ type: 'boolean', default: false })
  IsDisabled: boolean;

  @Column({ type: 'int', default: 0 })
  SortOrder: number;

  @Column({ type: 'character varying', length: 6 })
  Code: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Description: string;

  // Parent Agency Relations
  @Column({ name: 'parent_id', type: 'int', nullable: true })
  ParentId: number;

  @ManyToOne(() => Agency, (agency) => agency.Id)
  @JoinColumn({ name: 'parent_id' })
  @Index()
  Parent: Agency;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Email: string;

  @Column({ type: 'boolean' })
  SendEmail: boolean;

  @Column({ type: 'character varying', length: 100, nullable: true })
  AddressTo: string;

  @Column({ type: 'character varying', length: 250, nullable: true })
  CCEmail: string;

  @OneToMany(() => User, (user) => user.Agency, { nullable: true })
  Users: Relation<User>[];
}
