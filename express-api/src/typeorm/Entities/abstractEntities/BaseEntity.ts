import type { User } from '@/typeorm/Entities/User';
import { UUID } from 'crypto';
import { Column, CreateDateColumn, ManyToOne, JoinColumn, Index, Relation } from 'typeorm';

export abstract class BaseEntity {
  @Column({ name: 'CreatedById' })
  CreatedById: UUID;

  @ManyToOne('Users', 'Users.Id')
  @JoinColumn({ name: 'CreatedById' })
  @Index()
  CreatedBy: Relation<User>;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column({ name: 'UpdatedById', nullable: true })
  UpdatedById: UUID;

  @ManyToOne('Users', 'Users.Id', { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  @Index()
  UpdatedBy: Relation<User>;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}
