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
  @Column({ name: 'template_id', type: 'int' })
  @Index()
  TemplateId: number;

  @ManyToOne(() => NotificationTemplate, (Template) => Template.Id)
  @JoinColumn({ name: 'template_id' })
  Template: NotificationTemplate;

  // From Status Relation
  @Column({ name: 'from_status_id', type: 'int', nullable: true })
  FromStatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'from_status_id' })
  FromStatus: ProjectStatus;

  // To Status Relation
  @Column({ name: 'to_status_id', type: 'int' })
  ToStatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'to_status_id' })
  @Index()
  ToStatus: ProjectStatus;

  @Column('int')
  Priority: number;

  @Column('int')
  Delay: number;

  @Column('int')
  DelayDays: number;
}
