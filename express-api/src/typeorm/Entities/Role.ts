import { UUID } from 'crypto';
import { Entity, Column, Index, PrimaryColumn, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { User } from '@/typeorm/Entities/User';

@Entity()
@Index(['IsDisabled', 'Name'])
export class Role extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @Column({ type: 'character varying', length: 100 })
  @Index({ unique: true })
  Name: string;

  @Column('boolean', { default: false })
  IsDisabled: boolean;

  @Column('int', { default: 0 })
  SortOrder: number;

  @Column('text', { nullable: true })
  Description: string;

  @OneToMany(() => User, (user) => user.Role)
  Users: Relation<User>[];
}
