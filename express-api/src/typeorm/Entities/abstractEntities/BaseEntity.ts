import type { Users } from '@/typeorm/Entities/Users';
import { UUID } from 'crypto';
import { Column, CreateDateColumn, ManyToOne, JoinColumn, Index, Relation } from 'typeorm';

export abstract class BaseEntity {
  @Column({ name: 'CreatedById' })
  CreatedById: UUID;

  @ManyToOne('Users', 'Users.Id')
  @JoinColumn({ name: 'CreatedById' })
  @Index()
  CreatedBy: Relation<Users>;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column({ name: 'UpdatedById', nullable: true })
  UpdatedById: UUID;

  @ManyToOne('Users', 'Users.Id', { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  @Index()
  UpdatedBy: Relation<Users>;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}
