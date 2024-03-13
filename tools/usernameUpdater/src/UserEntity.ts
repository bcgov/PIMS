import { UUID } from 'crypto';
import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  Relation,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum UserStatus {
  Active = 'Active',
  OnHold = 'OnHold',
  Denied = 'Denied',
  Disabled = 'Disabled',
}

@Entity()
export class User {

  @Column({ name: 'created_by_id' })
  CreatedById: UUID;

  @ManyToOne('User', 'User.Id')
  @JoinColumn({ name: 'created_by_id' })
  @Index()
  CreatedBy: Relation<User>;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column({ name: 'updated_by_id', nullable: true })
  UpdatedById: UUID;

  @ManyToOne('User', 'User.Id', { nullable: true })
  @JoinColumn({ name: 'updated_by_id' })
  @Index()
  UpdatedBy: Relation<User>;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;

  @PrimaryGeneratedColumn('uuid')
  Id: UUID;

  @Column({ type: 'character varying', length: 100 })
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

  // Role Relations
  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  RoleId: UUID;

  @Column({ type: 'enum', enum: UserStatus })
  Status: UserStatus;
}
