import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationQueueNullables1710371939468 implements MigrationInterface {
  name = 'NotificationQueueNullables1710371939468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ches_message_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ches_transaction_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ches_transaction_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ALTER COLUMN "ches_message_id" SET NOT NULL`,
    );
  }
}
