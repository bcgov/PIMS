import { Entity, Column, CreateDateColumn, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['Name'])
export class Provinces {
  @PrimaryColumn({ type: 'character varying', length: 2 })
  Id: string;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn('timestamp')
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @Column('timestamp')
  UpdatedOn: Date;

  @Column({ type: 'character varying', length: 100 })
  @Index({ unique: true })
  Name: string;
}
