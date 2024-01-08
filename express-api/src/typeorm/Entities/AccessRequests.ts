import { Agencies } from '@/typeorm/Entities/Agencies';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Roles } from '@/typeorm/Entities/Roles';
import { Users } from '@/typeorm/Entities/Users';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm';

@Entity()
export class AccessRequests extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Users, (user) => user.Id)
  @JoinColumn({ name: 'UserId' })
  @Index()
  UserId: Users;

  @Column({ type: 'character varying', length: 1000, nullable: true })
  Note: string;

  @Column({ type: 'int' })
  @Index()
  Status: number;

  @ManyToOne(() => Roles, (role) => role.Id)
  @JoinColumn({ name: 'RoleId' })
  RoleId: Roles;

  @ManyToOne(() => Agencies, (agency) => agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  AgencyId: Agencies;
}
