import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationQueueNullables1710370589915 implements MigrationInterface {
  name = 'NotificationQueueNullables1710370589915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_67a9fe6a893b69d0a42313823d5"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_e96934a5a81124580dd628602f"`);
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "template_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ches_message_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ches_transaction_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e96934a5a81124580dd628602f" ON "notification_queue" ("project_id", "template_id", "to_agency_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_67a9fe6a893b69d0a42313823d5" FOREIGN KEY ("template_id") REFERENCES "notification_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_67a9fe6a893b69d0a42313823d5"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_e96934a5a81124580dd628602f"`);
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ches_transaction_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ches_message_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "template_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e96934a5a81124580dd628602f" ON "notification_queue" ("project_id", "to_agency_id", "template_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_67a9fe6a893b69d0a42313823d5" FOREIGN KEY ("template_id") REFERENCES "notification_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
