import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Tag'])
export class NotificationTemplates {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @Column('timestamp')
  UpdatedOn: Date;

  @Column({ type: 'character varying', length: 100 })
  @Index({ unique: true })
  Name: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  To: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Cc: string;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Bcc: string;

  @Column({ type: 'character varying', length: 50 })
  Audience: string;

  @Column({ type: 'character varying', length: 50 })
  Encoding: string;

  @Column({ type: 'character varying', length: 50 })
  BodyType: string;

  @Column({ type: 'character varying', length: 50 })
  Priority: string;

  @Column({ type: 'character varying', length: 200 })
  Subject: string;

  @Column({ type: 'text', nullable: true })
  Body: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column({ type: 'character varying', length: 50, nullable: true })
  Tag: string;
}
