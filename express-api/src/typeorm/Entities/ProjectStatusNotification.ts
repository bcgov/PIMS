import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectStatus } from './ProjectStatus';
import { NotificationTemplate } from './NotificationTemplate';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['FromStatusId', 'ToStatusId'])
export class ProjectStatusNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => NotificationTemplate, (Template) => Template.Id)
  @JoinColumn({ name: 'TemplateId' })
  @Index()
  TemplateId: NotificationTemplate;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'FromStatusId' })
  @Index()
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
