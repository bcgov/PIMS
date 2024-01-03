import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Users, (user) => user.Id)
  @JoinColumn({ name: 'CreatedById' })
  CreatedById: Users;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne(() => Users, (user) => user.Id)
  @JoinColumn({ name: 'UpdatedById' })
  UpdatedById: Users;

  @Column('timestamp')
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

  @Column('timestamp')
  LastLogin: Date;

  @ManyToOne(() => Users, (user) => user.Id, { nullable: true })
  @JoinColumn({ name: 'ApprovedById' })
  ApprovedById: Users;

  @Column({ type: 'timestamp', nullable: true })
  ApprovedOn: Date;

  @Column({ type: 'uuid', nullable: true })
  @Index({ unique: true })
  KeycloakUserId: string;
}
