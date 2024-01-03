import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name', 'SortOrder'])
export class PropertyTypes {
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

  @Column({ type: 'character varying', length: 150 })
  @Index({ unique: true })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;
}
