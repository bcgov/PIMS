import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Roles } from '@/typeorm/Entities/Roles';
import { Users } from '@/typeorm/Entities/Users';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '@/controllers/users/usersSchema';

@Entity()
export class UserRoles extends BaseEntity {
  @ManyToOne(() => Users, (user) => user.Id)
  @JoinColumn({ name: 'UserId' })
  @PrimaryColumn('uuid')
  UserId: User;

  @ManyToOne(() => Roles, (role) => role.Id)
  @JoinColumn({ name: 'RoleId' })
  @PrimaryColumn('character varying')
  AgencyId: Roles;
}
