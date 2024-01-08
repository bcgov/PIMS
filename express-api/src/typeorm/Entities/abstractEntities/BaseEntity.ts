import { Users } from '@/typeorm/Entities/Users';
import { Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';

export abstract class BaseEntity {
  @ManyToOne(() => Users, (user) => user.Id)
  @JoinColumn({ name: 'CreatedById' })
  @Index()
  CreatedById: Users;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne(() => Users, (user) => user.Id, { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  @Index()
  UpdatedById: Users;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}
