import { Users } from '@/typeorm/Entities/Users_Agencies_Roles_Claims';
import { Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';

export abstract class BaseEntity {
  @ManyToOne(() => Users, (User) => User.Id)
  @JoinColumn({ name: 'CreatedById' })
  @Index()
  CreatedById: Users;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne(() => Users, (User) => User.Id, { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  @Index()
  UpdatedById: Users;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}
