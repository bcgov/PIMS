import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Roles } from '@/typeorm/Entities/Roles';
import { Claims } from '@/typeorm/Entities/Claims';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class RoleClaims extends BaseEntity {
  @ManyToOne(() => Roles, (role) => role.Id)
  @JoinColumn({ name: 'RoleId' })
  @PrimaryColumn('int')
  RoleId: Roles;

  @ManyToOne(() => Claims, (claim) => claim.Id)
  @JoinColumn({ name: 'ClaimId' })
  @PrimaryColumn('int')
  ClaimId: Claims;
}
