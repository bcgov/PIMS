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

  @OneToMany(() => Users, (user) => user.Role)
  Users: Users[];
}
