import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectStatus } from './ProjectStatus';
import { NotificationTemplates } from './NotificationTemplates';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';

@Entity()
@Index(['FromStatusId', 'ToStatusId'])
export class ProjectStatusNotifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => NotificationTemplates, (template) => template.Id)
  @JoinColumn({ name: 'TemplateId' })
  @Index()
  TemplateId: NotificationTemplates;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'FromStatusId' })
  FromStatusId: ProjectStatus;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'ToStatusId' })
  @Index()
  ToStatusId: ProjectStatus;

  @Column('int')
  Priority: number;

  @Column('int')
  Delay: number;

  @Column('int')
  DelayDays: number;
}
