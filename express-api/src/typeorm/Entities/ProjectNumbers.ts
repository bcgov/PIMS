import { BaseEntity } from '@/typeorm/Entities/BaseEntity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectNumbers extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;
}
