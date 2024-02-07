import { UUID } from 'crypto';
import { Entity, Column, ManyToOne, Index, JoinColumn, PrimaryColumn, Relation } from 'typeorm';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Roles } from '@/typeorm/Entities/Roles';

@Entity()
export class Users extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @Column({ type: 'character varying', length: 25 })
  @Index({ unique: true })
  Username: string;

  @Column({ type: 'character varying', length: 100 })
  DisplayName: string;

  @Column({ type: 'character varying', length: 100 })
  FirstName: string;

  @Column({ type: 'character varying', length: 100, nullable: true })
  MiddleName: string;

  @Column({ type: 'character varying', length: 100 })
  LastName: string;

  @Column({ type: 'character varying', length: 100 })
  @Index({ unique: true })
  Email: string;

  @Column({ type: 'character varying', length: 100, nullable: true })
  Position: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('bit')
  EmailVerified: boolean;

  @Column('bit')
  IsSystem: boolean;

  @Column({ type: 'character varying', length: 1000, nullable: true })
  Note: string;

  @Column({ type: 'timestamp', nullable: true })
  LastLogin: Date;

  @Column({ name: 'ApprovedById', type: 'uuid', nullable: true })
  ApprovedById: UUID;

  @ManyToOne(() => Users, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'ApprovedById' })
  ApprovedBy: Users;

  @Column({ type: 'timestamp', nullable: true })
  ApprovedOn: Date;

  @Column({ type: 'uuid', nullable: true })
  @Index({ unique: true })
  KeycloakUserId: string;

  // Agency Relations
  @Column({ name: 'AgencyId', type: 'int', nullable: true })
  AgencyId: number;

  @ManyToOne(() => Agencies, (agency) => agency.Users, { nullable: true })
  @JoinColumn({ name: 'AgencyId' })
  Agency: Relation<Agencies>;

  // Role Relations
  @Column({ name: 'RoleId', type: 'uuid', nullable: true })
  RoleId: UUID;

  @ManyToOne(() => Roles, (role) => role.Users, { nullable: true })
  @JoinColumn({ name: 'RoleId' })
  Role: Relation<Roles>;
}
