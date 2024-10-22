import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JurRollPidXref {
  @PrimaryColumn({ type: 'int', name: 'pid' })
  PID: number;

  @PrimaryColumn({ type: 'character varying', length: 3, name: 'jurisdiction_code' })
  JurisdictionCode: string;

  @PrimaryColumn({ type: 'character varying', length: 15, name: 'roll_number' })
  RollNumber: string;
}
