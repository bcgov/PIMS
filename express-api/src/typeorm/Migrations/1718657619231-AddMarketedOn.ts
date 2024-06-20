import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMarketedOn1718657619231 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO timestamp_type VALUES ('00000000-0000-0000-0000-000000000000', '2024-06-12 18:05:54.537624',	NULL, NULL, 13, 'MarketedOn', False, 0,	NULL, True ,41)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM timestamp_type WHERE id = 13`);
  }
}
