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
} from 'typeorm';

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

  @ManyToOne(() => Users, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'ApprovedById' })
  ApprovedById: Users;

  @Column({ type: 'timestamp', nullable: true })
  ApprovedOn: Date;

  @Column({ type: 'uuid', nullable: true })
  @Index({ unique: true })
  KeycloakUserId: string;

  @OneToMany(() => UserAgencies, (userAgency) => userAgency.User, { cascade: true })
  UserAgencies: UserAgencies[];

  @OneToMany('UserRoles', 'UserRoles.User', { cascade: true })
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

  @OneToMany(() => UserAgencies, (userAgency) => userAgency.Agency)
  UserAgencies: UserAgencies[];
}

@Entity()
export class UserAgencies extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: '6' })
  AgencyId: string;

  @PrimaryColumn()
  UserId: string;

  @ManyToOne(() => Users, (User) => User.UserAgencies)
  @JoinColumn({ name: 'UserId', referencedColumnName: 'Id' })
  User: Users;

  @ManyToOne(() => Agencies, (Agency) => Agency.UserAgencies)
  @JoinColumn({ name: 'AgencyId', referencedColumnName: 'Id' })
  Agency: Agencies;
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

  @OneToMany('UserRoles', 'UserRoles.Role')
  UserRoles: UserRoles[];

  @OneToMany('RoleClaims', 'RoleClaims.Role')
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

  @OneToMany('RoleClaims', 'RoleClaims.Claim')
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
