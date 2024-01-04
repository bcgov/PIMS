import { Users } from '@/typeorm/Entities/Users';
import { Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export abstract class BaseEntity {
  @ManyToOne(() => Users, (user) => user.Id)
  @JoinColumn({ name: 'CreatedById' })
  CreatedById: Users;

  @CreateDateColumn()
  CreatedOn: Date;

  @ManyToOne(() => Users, (user) => user.Id, { nullable: true })
  @JoinColumn({ name: 'UpdatedById' })
  UpdatedById: Users;

  @Column({ type: 'timestamp', nullable: true })
  UpdatedOn: Date;
}
