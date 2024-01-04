import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectStatus } from './ProjectStatus';
import { NotificationTemplates } from './NotificationTemplates';

@Entity()
@Index(['FromStatusId', 'ToStatusId'])
export class ProjectStatusNotifications {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn()
  UpdatedOn: Date;

  @Column('int')
  Priority: number;

  @Column('int')
  Delay: number;

  @Column('int')
  DelayDays: number;

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
}
