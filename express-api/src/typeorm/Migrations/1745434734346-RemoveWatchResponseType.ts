import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveWatchResponseType1745434734346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Move all Watch responses to Subscribe
    // This is a one-way migration. The Watch response type is removed from the database and the code.
    await queryRunner.query(`
        UPDATE project_agency_response
        SET response = 1
        WHERE response = 2;
        `);
  }

  public async down(): Promise<void> {
    // There is no going back from this.
    // The enum value is removed from the database and the code.
  }
}
