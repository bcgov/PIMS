import { UUID } from 'crypto';
import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import type { Roles } from './Roles';
import type { Agencies } from './Agencies';

// This class cannot extend BaseEntity. It creates a circular reference that TypeORM can't handle.
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

  @ManyToMany('Roles', 'Users')
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'UserId',
    },
    inverseJoinColumn: {
      referencedColumnName: 'Id',
      name: 'RoleId',
    },
  })
  Roles: Roles[];

  @ManyToMany('Agencies', 'Users')
  @JoinTable({
    name: 'user_agencies',
    joinColumn: {
      name: 'UserId',
    },
    inverseJoinColumn: {
      referencedColumnName: 'Id',
      name: 'AgencyId',
    },
  })
  Agencies: Agencies[];
}
