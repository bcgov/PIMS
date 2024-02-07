import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { User } from '@/typeorm/Entities/User';
import { Role } from '@/typeorm/Entities/Role';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Agency } from './Agency';

@Entity()
export class AccessRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => User, (User) => User.Id)
  @JoinColumn({ name: 'UserId' })
  @Index()
  UserId: User;

  @Column({ type: 'character varying', length: 1000, nullable: true })
  Note: string;

  @Column({ type: 'int' })
  @Index()
  Status: number;

  @ManyToOne(() => Role, (Role) => Role.Id)
  @JoinColumn({ name: 'RoleId' })
  RoleId: Role;

  @ManyToOne(() => Agency, (Agency) => Agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  AgencyId: Agency;
}
