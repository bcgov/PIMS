import { BaseEntity } from '@/typeorm/Entities/BaseEntity';
import { Users } from '@/typeorm/Entities/Users'; // Adjust the path based on your project structure
import { Agencies, Agency } from '@/typeorm/Entities/Agencies'; // Adjust the path based on your project structure
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '@/controllers/users/usersSchema';

@Entity()
export class UserAgency extends BaseEntity {
  @PrimaryColumn('uuid')
  UserId: string;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn({ name: 'UserId' })
  User: User;

  @PrimaryColumn('int')
  AgencyId: number;

  @ManyToOne(() => Agency, { nullable: false })
  @JoinColumn({ name: 'AgencyId' })
  Agency: Agency;
}
