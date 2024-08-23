import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropOldTables1723752428732 implements MigrationInterface {
  name = 'DropOldTables1723752428732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop workflow from project table
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_4628115f61e423da4bc701b05b2"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_4628115f61e423da4bc701b05b"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "workflow_id"`);

    // Remove workflow id relation from Project Status History
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_e5822955d8e332b0f87bf321c9b"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_e5822955d8e332b0f87bf321c9"`);
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "PK_d07a59be210b8e9b5610a117a71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "PK_21f33ce85d4930045774379c811" PRIMARY KEY ("id", "project_id", "status_id")`,
    );
    await queryRunner.query(`ALTER TABLE "project_status_history" DROP COLUMN "workflow_id"`);
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_19c81903135d9364ed8b7a77025"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_233b1e713d63e72c6c89c4b4de5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "PK_21f33ce85d4930045774379c811"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "PK_1de0a41fc01d3a67040159c5acf" PRIMARY KEY ("id", "status_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "PK_1de0a41fc01d3a67040159c5acf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "PK_97d27898a32d73f93930dd394d2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_19c81903135d9364ed8b7a77025" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_233b1e713d63e72c6c89c4b4de5" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Drop old tables
    await queryRunner.query(`DROP TABLE IF EXISTS "project_number"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_status_transition"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workflow_project_status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_report"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workflow"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore workflow table
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS public.workflow
        (
            created_by_id uuid NOT NULL,
            created_on timestamp without time zone NOT NULL DEFAULT now(),
            updated_by_id uuid,
            updated_on timestamp without time zone DEFAULT now(),
            id integer NOT NULL,
            name character varying(150) COLLATE pg_catalog."default" NOT NULL,
            is_disabled boolean NOT NULL DEFAULT false,
            sort_order integer NOT NULL DEFAULT 0,
            code character varying(20) COLLATE pg_catalog."default" NOT NULL,
            description text COLLATE pg_catalog."default",
            CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY (id),
            CONSTRAINT "FK_6751772461f57fce9e203dcf85d" FOREIGN KEY (updated_by_id)
                REFERENCES public."user" (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT "FK_850de9126bf49cec75e10d05f32" FOREIGN KEY (created_by_id)
                REFERENCES public."user" (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
        )`);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_21a97bacb8d918364bfa10fb51"
            ON public.workflow USING btree
            (is_disabled ASC NULLS LAST, name COLLATE pg_catalog."default" ASC NULLS LAST, sort_order ASC NULLS LAST)
            TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_6751772461f57fce9e203dcf85"
            ON public.workflow USING btree
            (updated_by_id ASC NULLS LAST)
            TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_850de9126bf49cec75e10d05f3"
            ON public.workflow USING btree
            (created_by_id ASC NULLS LAST)
            TABLESPACE pg_default`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_8ec5afd3566bb368910c59f441"
            ON public.workflow USING btree
            (name COLLATE pg_catalog."default" ASC NULLS LAST)
            TABLESPACE pg_default`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_de26b0da4a2499eb21642e26d6"
            ON public.workflow USING btree
            (code COLLATE pg_catalog."default" ASC NULLS LAST)
            TABLESPACE pg_default`);

    // Restore workfow id to project
    await queryRunner.query(`ALTER TABLE "project" ADD "workflow_id" integer`);
    await queryRunner.query(
      `CREATE INDEX "IDX_4628115f61e423da4bc701b05b" ON "project" ("workflow_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_4628115f61e423da4bc701b05b2" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Rebuild dropped tables
    // project_status_transition
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

    // workflow_project_status
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.workflow_project_status
        (   
            created_by_id uuid NOT NULL,
            created_on timestamp without time zone NOT NULL DEFAULT now(),
            updated_by_id uuid,
            updated_on timestamp without time zone DEFAULT now(),
            workflow_id integer NOT NULL,
            status_id integer NOT NULL,
            sort_order integer NOT NULL DEFAULT 0,
            is_optional boolean NOT NULL,
            CONSTRAINT "PK_923798b735899f65f0eab056c94" PRIMARY KEY (workflow_id, status_id),
            CONSTRAINT "FK_7b1ec81b6623bfde3ac332e0bd7" FOREIGN KEY (updated_by_id)
                REFERENCES public."user" (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT "FK_a837264fbff4c627088b63664a4" FOREIGN KEY (created_by_id)
                REFERENCES public."user" (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT "FK_ce10450373e4ef5763e1f62109e" FOREIGN KEY (status_id)
                REFERENCES public.project_status (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT "FK_f8e27f9528e46182aaa76f4e28d" FOREIGN KEY (workflow_id)
                REFERENCES public.workflow (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
        )`);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_7b1ec81b6623bfde3ac332e0bd"
        ON public.workflow_project_status USING btree
        (updated_by_id ASC NULLS LAST)
        TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_a837264fbff4c627088b63664a"
        ON public.workflow_project_status USING btree
        (created_by_id ASC NULLS LAST)
        TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ce10450373e4ef5763e1f62109"
        ON public.workflow_project_status USING btree
        (status_id ASC NULLS LAST)
        TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_f8e27f9528e46182aaa76f4e28"
        ON public.workflow_project_status USING btree
        (workflow_id ASC NULLS LAST)
        TABLESPACE pg_default`);

    // project_report
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.project_report
        (
            created_by_id uuid NOT NULL,
            created_on timestamp without time zone NOT NULL DEFAULT now(),
            updated_by_id uuid,
            updated_on timestamp without time zone DEFAULT now(),
            id serial NOT NULL,
            is_final boolean NOT NULL,
            name character varying(250) COLLATE pg_catalog."default",
            "from" timestamp without time zone,
            "to" timestamp without time zone NOT NULL,
            report_type_id integer NOT NULL,
            CONSTRAINT "PK_432e2dd90f9890c20cf96844749" PRIMARY KEY (id),
            CONSTRAINT "FK_4d3c5d03e8b0d7e639e4f8781ca" FOREIGN KEY (updated_by_id)
                REFERENCES public."user" (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT "FK_9bea5cd3cba9cc2b3563206f78b" FOREIGN KEY (report_type_id)
                REFERENCES public.report_type (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT "FK_ef5247e76cb327a3a0ea1fa832d" FOREIGN KEY (created_by_id)
                REFERENCES public."user" (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
        )`);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_4d3c5d03e8b0d7e639e4f8781c"
        ON public.project_report USING btree
        (updated_by_id ASC NULLS LAST)
        TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_e4998c66591ebea5e8c1c2d575"
        ON public.project_report USING btree
        (id ASC NULLS LAST, "to" ASC NULLS LAST, "from" ASC NULLS LAST, is_final ASC NULLS LAST)
        TABLESPACE pg_default`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ef5247e76cb327a3a0ea1fa832"
        ON public.project_report USING btree
        (created_by_id ASC NULLS LAST)
        TABLESPACE pg_default`);

    // We do not restore project_number. It will not used.

    // Restore workflow id relation on Project Status History, but nullable, not as PK
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_233b1e713d63e72c6c89c4b4de5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_19c81903135d9364ed8b7a77025"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "PK_97d27898a32d73f93930dd394d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "PK_1de0a41fc01d3a67040159c5acf" PRIMARY KEY ("id", "status_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "PK_1de0a41fc01d3a67040159c5acf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "PK_21f33ce85d4930045774379c811" PRIMARY KEY ("id", "project_id", "status_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_233b1e713d63e72c6c89c4b4de5" FOREIGN KEY ("status_id") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_19c81903135d9364ed8b7a77025" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "project_status_history" ADD "workflow_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "PK_21f33ce85d4930045774379c811"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "PK_d07a59be210b8e9b5610a117a71" PRIMARY KEY ("id", "project_id", "status_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e5822955d8e332b0f87bf321c9" ON "project_status_history" ("workflow_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_e5822955d8e332b0f87bf321c9b" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
