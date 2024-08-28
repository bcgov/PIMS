import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';

type BulkUploadRowResult = {
  action: 'inserted' | 'updated' | 'ignored' | 'error';
  reason?: string;
};

@Entity()
export class ImportResult extends SoftDeleteEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150, name: 'file_name' })
  FileName: string;

  @Column({ type: 'float', name: 'completion_percentage' })
  CompletionPercentage: number;

  @Column({ name: 'results', type: 'jsonb', nullable: true })
  Results: BulkUploadRowResult[];

  @Column({ type: 'character varying', length: 250, name: 'message', nullable: true })
  Message: string;
}
