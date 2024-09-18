import { MigrationInterface, QueryRunner } from 'typeorm';

export class KeycloakUserIdType1726615038425 implements MigrationInterface {
  name = 'KeycloakUserIdType1726615038425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN keycloak_user_id TYPE CHARACTER VARYING(36) USING keycloak_user_id::TEXT;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN keycloak_user_id TYPE UUID USING keycloak_user_id::UUID;`,
    );
  }
}
