import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from '@/typeorm/Entities/Project';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { Agency } from './Agency';

@Entity()
export class ProjectAgencyResponse extends BaseEntity {
  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  @PrimaryColumn('int')
  ProjectId: Project;

  @ManyToOne(() => Agency, (Agency) => Agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  @PrimaryColumn('int')
  AgencyId: Agency;

  @Column({ type: 'money' })
  OfferAmount: number;

  @ManyToOne(() => NotificationQueue, (Notification) => Notification.Id, { nullable: true })
  @JoinColumn({ name: 'NotificationId' })
  @Index()
  NotificationId: NotificationQueue;

  // What is this field?
  @Column({ type: 'int' })
  Response: number;

  @Column({ type: 'timestamp', nullable: true })
  ReceivedOn: Date;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  Note: string;
}
