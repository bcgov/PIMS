import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Users } from '@/typeorm/Entities/Users'; // Adjust the path based on your project structure
import { Agencies } from '@/typeorm/Entities/Agencies'; // Adjust the path based on your project structure
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '@/controllers/users/usersSchema';

@Entity()
export class UserAgencies extends BaseEntity {
  @ManyToOne(() => Users, (user) => user.Id)
  @JoinColumn({ name: 'UserId' })
  @PrimaryColumn('uuid')
  UserId: User;

  @ManyToOne(() => Agencies, (agency) => agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  @PrimaryColumn('character varying')
  AgencyId: Agencies;
}
