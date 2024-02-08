import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { User } from '@/typeorm/Entities/User';
import { Role } from '@/typeorm/Entities/Role';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Agency } from './Agency';
import { UUID } from 'crypto';

@Entity()
export class AccessRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  // User Relations
  @Column({ name: 'UserId', type: 'uuid' })
  UserId: UUID;

  @ManyToOne(() => User, (User) => User.Id)
  @JoinColumn({ name: 'UserId' })
  @Index()
  User: User;

  @Column({ type: 'character varying', length: 1000, nullable: true })
  Note: string;

  @Column({ type: 'int' })
  @Index()
  Status: number;

  // Role Relations
  @Column({ name: 'RoleId', type: 'uuid' })
  RoleId: UUID;

  @ManyToOne(() => Role, (Role) => Role.Id)
  @JoinColumn({ name: 'RoleId' })
  Role: Role;

  // Agency Relations
  @Column({ name: 'AgencyId', type: 'int' })
  AgencyId: number;

  @ManyToOne(() => Agency, (Agency) => Agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  Agency: Agency;
}
