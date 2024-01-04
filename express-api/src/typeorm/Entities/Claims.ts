import { BaseEntity } from '@/typeorm/Entities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name'])
export class Claims extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

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
