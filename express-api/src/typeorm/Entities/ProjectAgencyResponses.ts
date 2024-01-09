import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Projects } from '@/typeorm/Entities/Projects';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';

@Entity()
export class ProjectAgencyResponses extends BaseEntity {
  @ManyToOne(() => Projects, (project) => project.Id)
  @JoinColumn({ name: 'ProjectId' })
  @PrimaryColumn('int')
  ProjectId: Projects;

  @ManyToOne(() => Agencies, (agency) => agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  @PrimaryColumn('int')
  AgencyId: Agencies;

  @Column({ type: 'money' })
  OfferAmount: number;

  @ManyToOne(() => NotificationQueue, (notification) => notification.Id, { nullable: true })
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
