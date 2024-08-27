import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLegalDescriptionLineFromTemplates1724169663927 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        -- Remove 'Legal' line with leading and trailing spaces and line breaks
        UPDATE notification_template
        SET body = REPLACE(body, '
                    Legal: {{ property.LandLegalDescription }}
                    <br> ', '')
        WHERE body LIKE '%Legal: {{ property.LandLegalDescription }}%';

        -- Remove 'Legal' line with leading spaces and line breaks but without trailing spaces
        UPDATE notification_template
        SET body = REPLACE(body, '
                    Legal: {{ property.LandLegalDescription }}
<br> ', '')
        WHERE body LIKE '%Legal: {{ property.LandLegalDescription }}%';

        -- Remove 'Legal' line with no leading spaces
        UPDATE notification_template
        SET body = REPLACE(body, 'Legal: {{ property.LandLegalDescription }}<br>', '')
        WHERE body LIKE '%Legal: {{ property.LandLegalDescription }}%';
    `);
  }

  public async down(): Promise<void> {}
}
