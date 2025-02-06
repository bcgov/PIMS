import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from '@/typeorm/Entities/Project';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { Agency } from './Agency';
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';
import MoneyTransfomer from '../Transformers/MoneyTransformer';

@Entity()
export class ProjectAgencyResponse extends SoftDeleteEntity {
  // Project Relation
  @PrimaryColumn({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  Project: Project;

  // Agency Relation
  @PrimaryColumn({ name: 'agency_id', type: 'int' })
  AgencyId: number;

  @ManyToOne(() => Agency, (Agency) => Agency.Id)
  @JoinColumn({ name: 'agency_id' })
  Agency: Agency;

  @Column({ type: 'money', transformer: MoneyTransfomer })
  OfferAmount: number;

  // Notification Relation
  @Column({ name: 'notification_id', type: 'int', nullable: true })
  NotificationId: number;

  @ManyToOne(() => NotificationQueue, (Notification) => Notification.Id, { nullable: true })
  @JoinColumn({ name: 'notification_id' })
  @Index()
  Notification: NotificationQueue;

  // Refers to AgencyResponseType.
  @Column({ type: 'int' })
  Response: number;

  @Column({ type: 'timestamp', nullable: true })
  ReceivedOn: Date;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  Note: string;
}
