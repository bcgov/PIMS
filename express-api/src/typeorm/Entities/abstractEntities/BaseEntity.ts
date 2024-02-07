import type { User } from '@/typeorm/Entities/User_Role_Claim';
import { Column, CreateDateColumn, ManyToOne, JoinColumn, Index, Relation } from 'typeorm';

export abstract class BaseEntity {
  @ManyToOne('User', 'User.Id')
  @JoinColumn({ name: 'CreatedById' })
  @Index()
  CreatedById: Relation<User>;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne('User', 'User.Id', { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  @Index()
  UpdatedById: Relation<User>;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}
