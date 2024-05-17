import { UUID } from 'crypto';
import { Column, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export abstract class SoftDeleteEntity extends BaseEntity {
  @Column({ name: 'deleted_by_id', nullable: true })
  DeletedById: UUID;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  DeletedOn: Date;
}
