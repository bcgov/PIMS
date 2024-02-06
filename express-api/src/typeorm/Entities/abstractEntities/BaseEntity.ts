import type { Users } from '@/typeorm/Entities/Users_Roles_Claims';
import { Column, CreateDateColumn, ManyToOne, JoinColumn, Index, Relation } from 'typeorm';

export abstract class BaseEntity {
  @ManyToOne('Users', 'Users.Id')
  @JoinColumn({ name: 'CreatedById' })
  @Index()
  CreatedById: Relation<Users>;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne('Users', 'Users.Id', { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  @Index()
  UpdatedById: Relation<Users>;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}
