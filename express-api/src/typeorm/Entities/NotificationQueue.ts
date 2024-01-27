import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UUID } from 'crypto';
import { Projects } from '@/typeorm/Entities/Projects';
import { NotificationTemplates } from '@/typeorm/Entities/NotificationTemplates';
import { Agencies } from './Users_Agencies_Roles_Claims';

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

  @Column({ type: 'character varying', length: 2000 }) // Should be max length, but not clear what max is.
  Body: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Bcc: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Cc: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  Tag: string;

  @ManyToOne(() => Projects, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  ProjectId: Projects;

  @ManyToOne(() => Agencies, (Agency) => Agency.Id)
  @JoinColumn({ name: 'ToAgencyId' })
  @Index()
  ToAgencyId: Agencies;

  @ManyToOne(() => NotificationTemplates, (Template) => Template.Id)
  @JoinColumn({ name: 'TemplateId' })
  @Index()
  TemplateId: NotificationTemplates;

  @Column({ type: 'uuid' })
  ChesMessageId: UUID;

  @Column({ type: 'uuid' })
  ChesTransactionId: UUID;
}
