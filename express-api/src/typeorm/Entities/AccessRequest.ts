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
  @Column({ name: 'user_id', type: 'uuid' })
  UserId: UUID;

  @ManyToOne(() => User, (User) => User.Id)
  @JoinColumn({ name: 'user_id' })
  @Index()
  User: User;

  @Column({ type: 'character varying', length: 1000, nullable: true })
  Note: string;

  @Column({ type: 'int' })
  @Index()
  Status: number;

  // Role Relations
  @Column({ name: 'role_id', type: 'uuid' })
  RoleId: UUID;

  @ManyToOne(() => Role, (Role) => Role.Id)
  @JoinColumn({ name: 'role_id' })
  Role: Role;

  // Agency Relations
  @Column({ name: 'agency_id', type: 'int' })
  AgencyId: number;

  @ManyToOne(() => Agency, (Agency) => Agency.Id)
  @JoinColumn({ name: 'agency_id' })
  Agency: Agency;
}
