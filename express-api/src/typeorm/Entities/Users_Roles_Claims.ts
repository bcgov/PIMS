import { UUID } from 'crypto';
import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { Agencies } from './Agencies';

export enum UserStatus {
  Active = 'Active',
  OnHold = 'OnHold',
  Denied = 'Denied',
  Disabled = 'Disabled',
}

@Entity()
export class Users {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @ManyToOne(() => Users, (User) => User.Id)
  @JoinColumn({ name: 'CreatedById' })
  CreatedById: Users;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne(() => Users, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  UpdatedById: Users;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;

  @Column({ type: 'character varying', length: 50 })
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
  EmailVerified: boolean;

  @Column('bit')
  IsSystem: boolean;

  @Column({ type: 'character varying', length: 1000, nullable: true })
  Note: string;

  @Column({ type: 'timestamp', nullable: true })
  LastLogin: Date;

  @ManyToOne(() => Users, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'ApprovedById' })
  ApprovedById: Users;

  @Column({ type: 'timestamp', nullable: true })
  ApprovedOn: Date;

  @Column({ type: 'enum', enum: UserStatus })
  Status: UserStatus;

  @Column({ type: 'uuid', nullable: true })
  @Index({ unique: true })
  KeycloakUserId: string;

  @Column({ name: 'AgencyId', type: 'varchar', length: 6, nullable: true })
  AgencyId: string;

  @ManyToOne(() => Agencies, (agency) => agency.Users, { nullable: true })
  @JoinColumn({ name: 'AgencyId' })
  Agency: Relation<Agencies>;

  @OneToMany(() => UserRoles, (userRole) => userRole.User, { cascade: true })
  UserRoles: UserRoles[];
}

//This is copied from the BaseEntity in its own file. Obviously duplication is not ideal, but I doubt this will be getting changed much so should be acceptable.
//Can't just import it at the top since it depends on Users.
abstract class BaseEntity {
  @ManyToOne(() => Users, (User) => User.Id)
  @JoinColumn({ name: 'CreatedById' })
  @Index()
  CreatedById: Users;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne(() => Users, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  @Index()
  UpdatedById: Users;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}

@Entity()
@Index(['IsDisabled', 'Name'])
export class Roles extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @Column({ type: 'character varying', length: 100 })
  @Index({ unique: true })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column('uuid', { nullable: true })
  KeycloakGroupId: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsPublic: boolean;

  @OneToMany(() => UserRoles, (userRole) => userRole.Role)
  UserRoles: UserRoles[];

  @OneToMany(() => RoleClaims, (roleClaim) => roleClaim.Role)
  RoleClaims: RoleClaims[];
}

@Entity()
@Index(['IsDisabled', 'Name'])
export class Claims extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @Column({ type: 'character varying', length: 150 })
  @Index({ unique: true })
  Name: string;

  @Column('uuid', { nullable: true })
  KeycloakRoleId: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsDisabled: boolean;

  @OneToMany(() => RoleClaims, (roleClaim) => roleClaim.Claim)
  RoleClaims: RoleClaims[];
}

@Entity()
export class RoleClaims extends BaseEntity {
  @PrimaryColumn()
  RoleId: string;

  @PrimaryColumn()
  ClaimId: string;

  @ManyToOne(() => Roles, (Role) => Role.Id)
  @JoinColumn({ name: 'RoleId', referencedColumnName: 'Id' })
  Role: Roles;

  @ManyToOne(() => Claims, (Claim) => Claim.Id)
  @JoinColumn({ name: 'ClaimId', referencedColumnName: 'Id' })
  Claim: Claims;
}

@Entity()
export class UserRoles extends BaseEntity {
  @PrimaryColumn()
  RoleId: string;

  @PrimaryColumn()
  UserId: string;

  @ManyToOne(() => Users, (User) => User.UserRoles)
  @JoinColumn({ name: 'UserId', referencedColumnName: 'Id' })
  User: Users;

  @ManyToOne(() => Roles, (Role) => Role.UserRoles)
  @JoinColumn({ name: 'RoleId', referencedColumnName: 'Id' })
  Role: Roles;
}
