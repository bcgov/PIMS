import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name', 'SortOrder'])
export class ReportTypes {
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

  @Column({ type: 'character varying', length: 20 })
  @Index({ unique: true })
  Name: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;
}
