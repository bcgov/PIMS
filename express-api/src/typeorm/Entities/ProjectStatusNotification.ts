import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectStatus } from './ProjectStatus';
import { NotificationTemplate } from './NotificationTemplate';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['FromStatusId', 'ToStatusId'])
export class ProjectStatusNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  // Template Relation
  @Column({ name: 'TemplateId', type: 'int' })
  @Index()
  TemplateId: number;

  @ManyToOne(() => NotificationTemplate, (Template) => Template.Id)
  @JoinColumn({ name: 'TemplateId' })
  Template: NotificationTemplate;

  // From Status Relation
  @Column({ name: 'FromStatusId', type: 'int' })
  @Index()
  FromStatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'FromStatusId' })
  FromStatus: ProjectStatus;

  // To Status Relation
  @Column({ name: 'ToStatusId', type: 'int' })
  @Index()
  ToStatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'ToStatusId' })
  @Index()
  ToStatus: ProjectStatus;

  @Column('int')
  Priority: number;

  @Column('int')
  Delay: number;

  @Column('int')
  DelayDays: number;
}
