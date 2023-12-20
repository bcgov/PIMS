import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name'])
export class Roles {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn('timestamp')
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn('timestamp')
  UpdatedOn: Date;

  @Column({ type: 'character varying', length: 100 })
  @Index({ unique: true })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column('uuid', { nullable: true })
  KeycloakGroupId: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsPublic: boolean;
}
