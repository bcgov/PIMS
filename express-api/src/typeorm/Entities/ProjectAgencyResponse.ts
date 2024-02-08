import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from '@/typeorm/Entities/Project';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { Agency } from './Agency';

@Entity()
export class ProjectAgencyResponse extends BaseEntity {
  // Project Relation
  @PrimaryColumn({ name: 'ProjectId', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  // Agency Relation
  @PrimaryColumn({ name: 'AgencyId', type: 'int' })
  AgencyId: number;

  @ManyToOne(() => Agency, (Agency) => Agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  Agency: Agency;

  @Column({ type: 'money' })
  OfferAmount: number;

  // Notification Relation
  @Column({ name: 'NotificationId', type: 'int' })
  NotificationId: number;

  @ManyToOne(() => NotificationQueue, (Notification) => Notification.Id, { nullable: true })
  @JoinColumn({ name: 'NotificationId' })
  @Index()
  Notification: NotificationQueue;

  // What is this field?
  @Column({ type: 'int' })
  Response: number;

  @Column({ type: 'timestamp', nullable: true })
  ReceivedOn: Date;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  Note: string;
}
