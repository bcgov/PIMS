import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectNumber extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;
}
