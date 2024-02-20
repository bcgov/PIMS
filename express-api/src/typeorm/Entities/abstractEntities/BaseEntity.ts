import type { User } from '@/typeorm/Entities/User';
import { UUID } from 'crypto';
import { Column, CreateDateColumn, ManyToOne, JoinColumn, Index, Relation } from 'typeorm';

export abstract class BaseEntity {
  @Column({ name: 'created_by_id' })
  CreatedById: UUID;

  @ManyToOne('User', 'User.Id')
  @JoinColumn({ name: 'created_by_id' })
  @Index()
  CreatedBy: Relation<User>;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column({ name: 'updated_by_id', nullable: true })
  UpdatedById: UUID;

  @ManyToOne('User', 'User.Id', { nullable: true })
  @JoinColumn({ name: 'updated_by_id' })
  @Index()
  UpdatedBy: Relation<User>;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}
