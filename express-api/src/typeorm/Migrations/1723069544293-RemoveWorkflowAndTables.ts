import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveWorkflowAndTables1723069544293 implements MigrationInterface {
  name = 'RemoveWorkflowAndTables1723069544293';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_4628115f61e423da4bc701b05b2"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_4628115f61e423da4bc701b05b"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "workflow_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_number"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_status_transition"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ADD "workflow_id" integer`);
    await queryRunner.query(
      `CREATE INDEX "IDX_4628115f61e423da4bc701b05b" ON "project" ("workflow_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_4628115f61e423da4bc701b05b2" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.project_status_transition
      (
        created_by_id uuid NOT NULL,
        created_on timestamp without time zone NOT NULL DEFAULT now(),
        updated_by_id uuid,
        updated_on timestamp without time zone DEFAULT now(),
        from_workflow_id integer NOT NULL,
        from_status_id integer NOT NULL,
        to_workflow_id integer NOT NULL,
        to_status_id integer NOT NULL,
        action character varying(100) COLLATE pg_catalog."default" NOT NULL,
        validate_tasks boolean NOT NULL,
        CONSTRAINT "PK_7ba0ac3ad301fb1d042a0d9ea64" PRIMARY KEY (from_workflow_id, from_status_id, to_workflow_id, to_status_id),
        CONSTRAINT "FK_06f5e17dd6dcbdbb9cd92d0c649" FOREIGN KEY (created_by_id)
            REFERENCES public."user" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT "FK_2ad7770e567ca653d4e8f1344f6" FOREIGN KEY (from_status_id)
            REFERENCES public.project_status (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT "FK_4b66746df2c62b7de72f0e67081" FOREIGN KEY (from_workflow_id)
            REFERENCES public.workflow (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT "FK_8059210ea047e89826c2b5113fd" FOREIGN KEY (updated_by_id)
            REFERENCES public."user" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT "FK_a73ee3abfad8e26e23d4edff46d" FOREIGN KEY (to_status_id)
            REFERENCES public.project_status (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT "FK_fd1bdbd3c65a2d556ea320e469f" FOREIGN KEY (to_workflow_id)
            REFERENCES public.workflow (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_06f5e17dd6dcbdbb9cd92d0c64"
      ON public.project_status_transition USING btree
      (created_by_id ASC NULLS LAST)
      TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_1a95cbb3e28fca6816847ba828"
      ON public.project_status_transition USING btree
      (to_workflow_id ASC NULLS LAST, to_status_id ASC NULLS LAST)
      TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_1f35e96ec0f3b78b8324b0a1ef"
      ON public.project_status_transition USING btree
      (from_workflow_id ASC NULLS LAST, from_status_id ASC NULLS LAST)
      TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_8059210ea047e89826c2b5113f"
      ON public.project_status_transition USING btree
      (updated_by_id ASC NULLS LAST)
      TABLESPACE pg_default`);
    // We do not restore project_number. It is not used.
  }
}
