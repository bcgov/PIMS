import { UUID } from 'crypto';
import { Entity, Column, Index, PrimaryColumn, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Users } from '@/typeorm/Entities/Users';

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
  Users: Relation<Users>[];
}
