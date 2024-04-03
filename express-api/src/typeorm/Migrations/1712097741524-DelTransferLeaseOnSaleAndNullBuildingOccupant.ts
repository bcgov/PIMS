import { MigrationInterface, QueryRunner } from 'typeorm';

export class DelTransferLeaseOnSaleAndNullBuildingOccupant1712097741524
  implements MigrationInterface
{
  name = 'DelTransferLeaseOnSaleAndNullBuildingOccupant1712097741524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "building" DROP COLUMN "transfer_lease_on_sale"`);
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_f2f20f5727c0278f70ab5e07b44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ALTER COLUMN "building_occupant_type_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_f2f20f5727c0278f70ab5e07b44" FOREIGN KEY ("building_occupant_type_id") REFERENCES "building_occupant_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_f2f20f5727c0278f70ab5e07b44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ALTER COLUMN "building_occupant_type_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_f2f20f5727c0278f70ab5e07b44" FOREIGN KEY ("building_occupant_type_id") REFERENCES "building_occupant_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "building" ADD "transfer_lease_on_sale" boolean`);
    await queryRunner.query(`UPDATE "building" SET "transfer_lease_on_sale" = false`);
    await queryRunner.query(
      `ALTER TABLE "building" ALTER COLUMN "transfer_lease_on_sale" SET NOT NULL`,
    );
  }
}
