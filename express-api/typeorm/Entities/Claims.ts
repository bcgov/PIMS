import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name'])
export class Claims {
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

  @Column({ type: 'character varying', length: 150 })
  @Index({ unique: true })
  Name: string;

  @Column('uuid', { nullable: true })
  KeycloakRoleId: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsDisabled: boolean;
}
