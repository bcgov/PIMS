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
import { Agency } from './Agency';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @ManyToOne(() => User, (User) => User.Id)
  @JoinColumn({ name: 'CreatedById' })
  CreatedById: User;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne(() => User, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  UpdatedById: User;

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

  @ManyToOne(() => User, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'ApprovedById' })
  ApprovedById: User;

  @Column({ type: 'timestamp', nullable: true })
  ApprovedOn: Date;

  @Column({ type: 'uuid', nullable: true })
  @Index({ unique: true })
  KeycloakUserId: string;

  @Column({ name: 'AgencyId', type: 'int', nullable: true })
  AgencyId: number;

  @ManyToOne(() => Agency, (agency) => agency.User, { nullable: true })
  @JoinColumn({ name: 'AgencyId' })
  Agency: Relation<Agency>;

  @OneToMany(() => UserRole, (userRole) => userRole.User, { cascade: true })
  UserRoles: UserRole[];
}

//This is copied from the BaseEntity in its own file. Obviously duplication is not ideal, but I doubt this will be getting changed much so should be acceptable.
//Can't just import it at the top since it depends on Users.
abstract class BaseEntity {
  @ManyToOne(() => User, (User) => User.Id)
  @JoinColumn({ name: 'CreatedById' })
  @Index()
  CreatedById: User;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne(() => User, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  @Index()
  UpdatedById: User;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}

@Entity()
@Index(['IsDisabled', 'Name'])
export class Role extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @Column({ type: 'character varying', length: 100 })
  @Index({ unique: true })
  Name: string;

  @Column('boolean')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column('uuid', { nullable: true })
  KeycloakGroupId: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('boolean')
  IsPublic: boolean;

  @OneToMany(() => UserRole, (userRole) => userRole.Role)
  UserRoles: UserRole[];

  @OneToMany(() => RoleClaim, (roleClaim) => roleClaim.Role)
  RoleClaims: RoleClaim[];
}

@Entity()
@Index(['IsDisabled', 'Name'])
export class Claim extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @Column({ type: 'character varying', length: 150 })
  @Index({ unique: true })
  Name: string;

  @Column('uuid', { nullable: true })
  KeycloakRoleId: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('boolean')
  IsDisabled: boolean;

  @OneToMany(() => RoleClaim, (roleClaim) => roleClaim.Claim)
  RoleClaims: RoleClaim[];
}

@Entity()
export class RoleClaim extends BaseEntity {
  @PrimaryColumn()
  RoleId: string;

  @PrimaryColumn()
  ClaimId: string;

  @ManyToOne(() => Role, (Role) => Role.Id)
  @JoinColumn({ name: 'RoleId', referencedColumnName: 'Id' })
  Role: Role;

  @ManyToOne(() => Claim, (Claim) => Claim.Id)
  @JoinColumn({ name: 'ClaimId', referencedColumnName: 'Id' })
  Claim: Claim;
}

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryColumn()
  RoleId: string;

  @PrimaryColumn()
  UserId: string;

  @ManyToOne(() => User, (User) => User.UserRoles)
  @JoinColumn({ name: 'UserId', referencedColumnName: 'Id' })
  User: User;

  @ManyToOne(() => Role, (Role) => Role.UserRoles)
  @JoinColumn({ name: 'RoleId', referencedColumnName: 'Id' })
  Role: Role;
}
