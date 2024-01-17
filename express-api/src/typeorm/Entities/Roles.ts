import { UUID } from 'crypto';
import { Entity, PrimaryColumn, Column, Index, ManyToMany, JoinTable } from 'typeorm';
import type { Users } from './Users';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import type { Claims } from './Claims';

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

  @ManyToMany('Users', 'Roles')
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'RoleId',
    },
    inverseJoinColumn: {
      referencedColumnName: 'Id',
      name: 'UserId',
    },
  })
  Users: Users[];

  @ManyToMany('Claims', 'Roles')
  @JoinTable({
    name: 'role_claims',
    joinColumn: {
      name: 'RoleId',
    },
    inverseJoinColumn: {
      referencedColumnName: 'Id',
      name: 'ClaimId',
    },
  })
  Claims: Claims[];
}
