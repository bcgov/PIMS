import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UUID } from 'crypto';
import { Project } from '@/typeorm/Entities/Project';
import { NotificationTemplate } from '@/typeorm/Entities/NotificationTemplate';
import { Agency } from './Agency';

@Entity()
@Index(['Status', 'SendOn', 'Subject'])
@Index(['ProjectId', 'TemplateId', 'ToAgencyId'])
export class NotificationQueue extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  // What is this used for?
  @Column({ type: 'uuid' })
  @Index({ unique: true })
  Key: UUID;

  @Column({ type: 'int' })
  Status: number;

  @Column({ type: 'character varying', length: 50 })
  Priority: string;

  @Column({ type: 'character varying', length: 50 })
  Encoding: string;

  @Column({ type: 'timestamp' })
  SendOn: Date;

  @Column({ type: 'character varying', length: 500, nullable: true }) // How can this be nullable?
  To: string;

  @Column({ type: 'character varying', length: 200 })
  Subject: string;

  @Column({ type: 'character varying', length: 50 })
  BodyType: string;

  @Column({ type: 'text' })
  Body: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Bcc: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Cc: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  Tag: string;

  // Project Relation
  @Column({ name: 'project_id', type: 'int', nullable: true })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  Project: Project;

  // Agency Relation
  @Column({ name: 'to_agency_id', type: 'int', nullable: true })
  ToAgencyId: number;

  @ManyToOne(() => Agency, (Agency) => Agency.Id)
  @JoinColumn({ name: 'to_agency_id' })
  @Index()
  ToAgency: Agency;

  // Template Relation
  @Column({ name: 'template_id', type: 'int' })
  TemplateId: number;

  @ManyToOne(() => NotificationTemplate, (Template) => Template.Id)
  @JoinColumn({ name: 'template_id' })
  @Index()
  Template: NotificationTemplate;

  @Column({ type: 'uuid', nullable: true })
  ChesMessageId: UUID;

  @Column({ type: 'uuid', nullable: true })
  ChesTransactionId: UUID;
}
