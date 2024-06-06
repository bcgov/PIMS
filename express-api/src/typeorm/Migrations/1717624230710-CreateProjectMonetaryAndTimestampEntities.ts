import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectMonetaryAndTimestampEntities1717624230710 implements MigrationInterface {
  name = 'CreateProjectMonetaryAndTimestampEntities1717624230710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "monetary_type" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL DEFAULT false, "sort_order" integer NOT NULL DEFAULT '0', "description" text, "is_optional" boolean NOT NULL, "status_id" integer, CONSTRAINT "PK_69bca80c51bd372be86db65ddb3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_efc68f2f9cd8b4e622385fb341" ON "monetary_type" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8055410ea4e6bc86d4ade304ca" ON "monetary_type" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_monetary" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP DEFAULT now(), "deleted_by_id" uuid, "deleted_on" TIMESTAMP, "project_id" integer NOT NULL, "monetary_type_id" integer NOT NULL, "value" money NOT NULL, CONSTRAINT "PK_d249279221f79053fb210acfcd6" PRIMARY KEY ("project_id", "monetary_type_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_26febe43e239c3dab74733a1ba" ON "project_monetary" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3deb4806da20a5808cce624c89" ON "project_monetary" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c50698267ecb0ac5fd0226807f" ON "project_monetary" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1b117750428b647ddeee7c4e9d" ON "project_monetary" ("monetary_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d249279221f79053fb210acfcd" ON "project_monetary" ("project_id", "monetary_type_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "timestamp_type" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "is_disabled" boolean NOT NULL DEFAULT false, "sort_order" integer NOT NULL DEFAULT '0', "description" text, "is_optional" boolean NOT NULL, "status_id" integer, CONSTRAINT "PK_25278935ff332d599109298c90c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7bc210d8f6a044f296001bd2f7" ON "timestamp_type" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5ff99bd5ebd96101df9985109c" ON "timestamp_type" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_timestamp" ("created_by_id" uuid NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" uuid, "updated_on" TIMESTAMP DEFAULT now(), "deleted_by_id" uuid, "deleted_on" TIMESTAMP, "project_id" integer NOT NULL, "timestamp_type_id" integer NOT NULL, "value" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1f0cef6f1e6e37c76af8a8fb403" PRIMARY KEY ("project_id", "timestamp_type_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a09afddbf4e75214fbe9b6cba" ON "project_timestamp" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e04a1a937c4d488f413121bc0a" ON "project_timestamp" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9f2371a58642410b9ebbf0bda" ON "project_timestamp" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2def9d21e2e8521257a099837d" ON "project_timestamp" ("timestamp_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f0cef6f1e6e37c76af8a8fb40" ON "project_timestamp" ("project_id", "timestamp_type_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_type" ADD CONSTRAINT "FK_efc68f2f9cd8b4e622385fb3419" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_type" ADD CONSTRAINT "FK_8055410ea4e6bc86d4ade304cae" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_type" ADD CONSTRAINT "FK_fa074bf858029b45c196bfc893e" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" ADD CONSTRAINT "FK_26febe43e239c3dab74733a1ba6" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" ADD CONSTRAINT "FK_3deb4806da20a5808cce624c89f" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" ADD CONSTRAINT "FK_c50698267ecb0ac5fd0226807fe" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" ADD CONSTRAINT "FK_e23d09b23eda6954d6099f882a8" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" ADD CONSTRAINT "FK_1b117750428b647ddeee7c4e9d9" FOREIGN KEY ("monetary_type_id") REFERENCES "monetary_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "timestamp_type" ADD CONSTRAINT "FK_7bc210d8f6a044f296001bd2f72" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "timestamp_type" ADD CONSTRAINT "FK_5ff99bd5ebd96101df9985109cc" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "timestamp_type" ADD CONSTRAINT "FK_59df22206d4030745ec1e7b34f0" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" ADD CONSTRAINT "FK_6a09afddbf4e75214fbe9b6cba1" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" ADD CONSTRAINT "FK_e04a1a937c4d488f413121bc0a2" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" ADD CONSTRAINT "FK_a9f2371a58642410b9ebbf0bda6" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" ADD CONSTRAINT "FK_76ec567663722804c15dfc90500" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" ADD CONSTRAINT "FK_2def9d21e2e8521257a099837d9" FOREIGN KEY ("timestamp_type_id") REFERENCES "timestamp_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" DROP CONSTRAINT "FK_2def9d21e2e8521257a099837d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" DROP CONSTRAINT "FK_76ec567663722804c15dfc90500"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" DROP CONSTRAINT "FK_a9f2371a58642410b9ebbf0bda6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" DROP CONSTRAINT "FK_e04a1a937c4d488f413121bc0a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_timestamp" DROP CONSTRAINT "FK_6a09afddbf4e75214fbe9b6cba1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "timestamp_type" DROP CONSTRAINT "FK_59df22206d4030745ec1e7b34f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "timestamp_type" DROP CONSTRAINT "FK_5ff99bd5ebd96101df9985109cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "timestamp_type" DROP CONSTRAINT "FK_7bc210d8f6a044f296001bd2f72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" DROP CONSTRAINT "FK_1b117750428b647ddeee7c4e9d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" DROP CONSTRAINT "FK_e23d09b23eda6954d6099f882a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" DROP CONSTRAINT "FK_c50698267ecb0ac5fd0226807fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" DROP CONSTRAINT "FK_3deb4806da20a5808cce624c89f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_monetary" DROP CONSTRAINT "FK_26febe43e239c3dab74733a1ba6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_type" DROP CONSTRAINT "FK_fa074bf858029b45c196bfc893e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_type" DROP CONSTRAINT "FK_8055410ea4e6bc86d4ade304cae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_type" DROP CONSTRAINT "FK_efc68f2f9cd8b4e622385fb3419"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_1f0cef6f1e6e37c76af8a8fb40"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2def9d21e2e8521257a099837d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a9f2371a58642410b9ebbf0bda"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e04a1a937c4d488f413121bc0a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6a09afddbf4e75214fbe9b6cba"`);
    await queryRunner.query(`DROP TABLE "project_timestamp"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5ff99bd5ebd96101df9985109c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7bc210d8f6a044f296001bd2f7"`);
    await queryRunner.query(`DROP TABLE "timestamp_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d249279221f79053fb210acfcd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1b117750428b647ddeee7c4e9d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c50698267ecb0ac5fd0226807f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3deb4806da20a5808cce624c89"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_26febe43e239c3dab74733a1ba"`);
    await queryRunner.query(`DROP TABLE "project_monetary"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8055410ea4e6bc86d4ade304ca"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_efc68f2f9cd8b4e622385fb341"`);
    await queryRunner.query(`DROP TABLE "monetary_type"`);
  }
}
