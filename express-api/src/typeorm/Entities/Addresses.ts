// import { AdministrativeAreas } from '@/typeorm/Entities/AdministrativeAreas';
// import { Provinces } from '@/typeorm/Entities/Provinces';
// import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

// @Entity()
// export class Addresses {
//   @PrimaryGeneratedColumn()
//   Id: number;

//   @Column('uuid')
//   CreatedById: string;

//   @CreateDateColumn('timestamp')
//   CreatedOn: Date;

//   @Column('uuid')
//   UpdatedById: string;

//   @Column('timestamp')
//   UpdatedOn: Date;

//   @Column({ type: 'character varying', length: 150 })
//   Address1: string;

//   @Column({ type: 'character varying', length: 150 })
//   Address2: string;

//   @ManyToOne(() => Provinces, (province) => province.Id)
//   ProvinceId: Provinces;

//   @Column({ type: 'character varying', length: 6 })
//   Postal: string;

//   @ManyToOne(() => AdministrativeAreas, (adminArea) => adminArea.Id)
//   AdministrativeAreaId: number;
// }
