import { UUID } from 'crypto';
import { Column, DeleteDateColumn, Index, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from '../User';

export abstract class SoftDeleteEntity extends BaseEntity {
  @ManyToOne('User', 'User.Id', { nullable: true })
  @JoinColumn({ name: 'deleted_by_id' })
  @Index()
  DeletedBy: Relation<User>;

  @Column({ name: 'deleted_by_id', nullable: true })
  DeletedById: UUID;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  DeletedOn: Date;
}
