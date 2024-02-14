import { UUID } from 'crypto';
import { Entity, Column, ManyToOne, Index, JoinColumn, PrimaryColumn, Relation } from 'typeorm';
import { Agency } from '@/typeorm/Entities/Agency';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Role } from '@/typeorm/Entities/Role';

@Entity()
export class User extends BaseEntity {
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

  @Column('boolean')
  IsDisabled: boolean;

  @Column('boolean')
  EmailVerified: boolean;

  @Column('boolean')
  IsSystem: boolean;

  @Column({ type: 'character varying', length: 1000, nullable: true })
  Note: string;

  @Column({ type: 'timestamp', nullable: true })
  LastLogin: Date;

  @Column({ name: 'approved_by_id', type: 'uuid', nullable: true })
  ApprovedById: UUID;

  @ManyToOne(() => User, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'approved_by_id' })
  ApprovedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  ApprovedOn: Date;

  @Column({ type: 'uuid', nullable: true })
  @Index({ unique: true })
  KeycloakUserId: string;

  // Agency Relations
  @Column({ name: 'agency_id', type: 'int', nullable: true })
  AgencyId: number;

  @ManyToOne(() => Agency, (agency) => agency.Users, { nullable: true })
  @JoinColumn({ name: 'agency_id' })
  Agency: Relation<Agency>;

  // Role Relations
  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  RoleId: UUID;

  @ManyToOne(() => Role, (role) => role.Users, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  Role: Relation<Role>;
}
