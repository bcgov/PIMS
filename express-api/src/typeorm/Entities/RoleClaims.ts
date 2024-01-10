import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Roles } from '@/typeorm/Entities/Roles';
import { Claims } from '@/typeorm/Entities/Claims';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class RoleClaims extends BaseEntity {
  @ManyToOne(() => Roles, (Role) => Role.Id)
  @JoinColumn({ name: 'RoleId' })
  @PrimaryColumn('uuid')
  RoleId: Roles;

  @ManyToOne(() => Claims, (Claim) => Claim.Id)
  @JoinColumn({ name: 'ClaimId' })
  @PrimaryColumn('uuid')
  ClaimId: Claims;
}
