import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminAreaToERPNotifications1728680019519 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- update the "New Disposal Project Submitted template" first because of different formatting and spacing
            -- add a new line for the Site Location using the admin area name
            UPDATE notification_template
            SET body = REGEXP_REPLACE(
                          body, 
                          'Site Address: {{ property.Address1 }}' || chr(10) || '[[:space:]]+<br>',  -- to find all instances of spaces before the <br> that follows after a new line
                          'Site Address: {{ property.Address1 }}<br>' || chr(10) || chr(9) || chr(9) || chr(9) || chr(9) || chr(9) || 'Site Location: {{ property.AdministrativeArea.Name }}<br>',
                          'g')  -- 'g' to replace all instances within a template
            WHERE body LIKE '%Site Address: {{ property.Address1 }}' || chr(10) || '%<br>%' AND id = 1`);
    await queryRunner.query(`
            -- update the other 10 templates which have different spacing
            UPDATE notification_template
            SET body = REGEXP_REPLACE(
                          body, 
                          'Site Address: {{ property.Address1 }}<br>',  
                          'Site Address: {{ property.Address1 }}<br>' || chr(10) || chr(9) || chr(9) || chr(9) || chr(9) || chr(9) || chr(9) || chr(9) || chr(9) || chr(9) || 'Site Location: {{ property.AdministrativeArea.Name }}<br>',
                          'g')  -- 'g' to replace all instances within a template
            WHERE body LIKE '%Site Address: {{ property.Address1 }}<br>%' AND id >= 5 and id <= 14`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Remove administrative area line
            UPDATE notification_template
            SET body = REGEXP_REPLACE(
                          body, 
                          'Site Address: {{ property.Address1 }}<br>[\\s\\t]*Site Location: {{ property.AdministrativeArea.Name }}<br>', 
                          'Site Address: {{ property.Address1 }}' || chr(10) || chr(9) || chr(9) || chr(9) || chr(9) || chr(9) || '<br>', 
                          'g')  
            WHERE body LIKE '%Site Location: {{ property.AdministrativeArea.Name }}<br>%'
            AND id = 1`);

    await queryRunner.query(`
            -- Remove Site Location line and set it back the way it was
            UPDATE notification_template
            SET body = REGEXP_REPLACE(
                          body, 
                          'Site Address: {{ property.Address1 }}<br>[\\s\\t]*Site Location: {{ property.AdministrativeArea.Name }}<br>',  
                          'Site Address: {{ property.Address1 }}<br>',
                          'g')  -- 'g' to replace all instances within a template
            WHERE body LIKE '%Site Location: {{ property.AdministrativeArea.Name }}<br>%' 
            AND id >= 5 AND id <= 14
        `);
  }
}
