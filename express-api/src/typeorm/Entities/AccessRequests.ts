import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Users, Roles } from '@/typeorm/Entities/Users_Roles_Claims';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Agencies } from './Agencies';

@Entity()
export class AccessRequests extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Users, (User) => User.Id)
  @JoinColumn({ name: 'UserId' })
  @Index()
  UserId: Users;

  @Column({ type: 'character varying', length: 1000, nullable: true })
  Note: string;

  @Column({ type: 'int' })
  @Index()
  Status: number;

  @ManyToOne(() => Roles, (Role) => Role.Id)
  @JoinColumn({ name: 'RoleId' })
  RoleId: Roles;

  @ManyToOne(() => Agencies, (Agency) => Agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  AgencyId: Agencies;
}
