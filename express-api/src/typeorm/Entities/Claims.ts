import { UUID } from 'crypto';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, Column, Index, PrimaryColumn, JoinTable, ManyToMany } from 'typeorm';
import type { Roles } from './Roles';

@Entity()
@Index(['IsDisabled', 'Name'])
export class Claims extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  Id: UUID;

  @Column({ type: 'character varying', length: 150 })
  @Index({ unique: true })
  Name: string;

  @Column('uuid', { nullable: true })
  KeycloakRoleId: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsDisabled: boolean;

  @ManyToMany('Roles', 'Claims')
  @JoinTable({
    name: 'role_claims',
    joinColumn: {
      name: 'ClaimId',
    },
    inverseJoinColumn: {
      referencedColumnName: 'Id',
      name: 'RoleId',
    },
  })
  Roles: Roles[];
}
