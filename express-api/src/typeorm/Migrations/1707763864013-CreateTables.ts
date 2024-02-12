import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1707763864013 implements MigrationInterface {
  name = 'CreateTables1707763864013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agency" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" integer NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "Code" character varying(6) NOT NULL, "Description" character varying(500), "ParentId" integer, "Email" character varying(150), "SendEmail" boolean NOT NULL, "AddressTo" character varying(100), "CCEmail" character varying(250), CONSTRAINT "PK_b782cb3c20bab9b6eff7a661ad6" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57fd74ea1b8a1b0d85e1c7ad20" ON "agency" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4087b9d814a4a90af734b6dd3a" ON "agency" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89544ece79ad52653c8fce606b" ON "agency" ("ParentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5e16d9d279223ff5fe988f6a3b" ON "agency" ("ParentId", "IsDisabled", "Id", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" uuid NOT NULL, "Name" character varying(100) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "KeycloakGroupId" uuid, "Description" text, "IsPublic" boolean NOT NULL, CONSTRAINT "PK_ab3dbbb04afe867d22e43aacad5" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_051c6dcae604d9286f20cc2d76" ON "role" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a24ac662369d88db55649f3e5" ON "role" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_65aaedd70b9d60594dddcc36b2" ON "role" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_882f8f0de8c784abe421f17cd4" ON "role" ("IsDisabled", "Name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" uuid NOT NULL, "Username" character varying(25) NOT NULL, "DisplayName" character varying(100) NOT NULL, "FirstName" character varying(100) NOT NULL, "MiddleName" character varying(100), "LastName" character varying(100) NOT NULL, "Email" character varying(100) NOT NULL, "Position" character varying(100), "IsDisabled" boolean NOT NULL, "EmailVerified" boolean NOT NULL, "IsSystem" boolean NOT NULL, "Note" character varying(1000), "LastLogin" TIMESTAMP, "ApprovedById" uuid, "ApprovedOn" TIMESTAMP, "KeycloakUserId" uuid, "AgencyId" integer, "RoleId" uuid, CONSTRAINT "PK_1e4be10b13490bd87f4cc30c142" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_061257d343976f0dd80167c79e" ON "user" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdcb63fdec2cdf48ea4589557d" ON "user" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b000857089edf6cae23b9bc9b8" ON "user" ("Username") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b7eee57d84fb7ed872e660197f" ON "user" ("Email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c01351e0689032ad8995861393" ON "user" ("KeycloakUserId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "access_request" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "UserId" uuid NOT NULL, "Note" character varying(1000), "Status" integer NOT NULL, "RoleId" uuid NOT NULL, "AgencyId" integer NOT NULL, CONSTRAINT "PK_e655a6c3c0132a8b756aaa44c2a" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c3e2e1bb170870974db5ce848f" ON "access_request" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f567e907073e1bf5af072410c" ON "access_request" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_352664edaa51c51a3f62d1cd8a" ON "access_request" ("UserId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_25dccf2207a003f5ecce8a33c7" ON "access_request" ("Status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_construction_type" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, CONSTRAINT "PK_dc31406e12839c288095a312f15" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3bf46797647574d5aeb8122a5a" ON "building_construction_type" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6744ccd2014fd4e75709410415" ON "building_construction_type" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1fe605fd95d54c7a3d8fb8ea63" ON "building_construction_type" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7eb84eaff27e41814425e258bf" ON "building_construction_type" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_occupant_type" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, CONSTRAINT "PK_c75762463433058aa9795469f08" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09f8f34216ccfffd99add29359" ON "building_occupant_type" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c40ce91f4fff8b30bc116e66d5" ON "building_occupant_type" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4068747f6c9171d4106950eed9" ON "building_occupant_type" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4305f752c6248063c083a27f4" ON "building_occupant_type" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_predominate_use" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, CONSTRAINT "PK_c144048a0ef4e9d0c6174d12593" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a6adc6a5b01c4024621c52b1a2" ON "building_predominate_use" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_088d32f15fd51a4eee07cdde28" ON "building_predominate_use" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8d85670f0a3bb38094f1db9023" ON "building_predominate_use" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ae7808ddc529eb5f08dac71874" ON "building_predominate_use" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "regional_district" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" integer NOT NULL, "Abbreviation" character varying(5) NOT NULL, "Name" character varying(250) NOT NULL, CONSTRAINT "PK_ed5100402d64f5a45c30e724fe4" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_336d5c7c816dc621dbc820cc2a" ON "regional_district" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d8f11c563f58d60c57c96b7b83" ON "regional_district" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ed5100402d64f5a45c30e724fe" ON "regional_district" ("Id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_388afb0f03dd0bc943949c24e8" ON "regional_district" ("Name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "province" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" character varying(2) NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_b3ca2985c24eae4071940805437" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff339e05eab922546e009f6cc7" ON "province" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9d396303fe83e044d69531b128" ON "province" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b54101e216cdd5a65212744139" ON "province" ("Name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "administrative_area" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "RegionalDistrictId" integer NOT NULL, "ProvinceId" character varying(2) NOT NULL, CONSTRAINT "Unique_Name_RegionalDistrict" UNIQUE ("Name", "RegionalDistrictId"), CONSTRAINT "PK_bf3794e302bec7911342a790f50" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d89023b6b9a759bee9ba30d08" ON "administrative_area" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68d342e36be4fc4f78d1d943c1" ON "administrative_area" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5b6c7d4abbf4a76127c1b3494" ON "administrative_area" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09ecbd0495a18dd9c5648e6ede" ON "administrative_area" ("RegionalDistrictId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af5f23834c3bd813da5cd195da" ON "administrative_area" ("ProvinceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a3c788ce5a2d7ee0708b63755c" ON "administrative_area" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "property_classification" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "IsVisible" boolean NOT NULL, CONSTRAINT "PK_d069abd1b928cc373f16db18084" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0995f092c645d5412712204fa0" ON "property_classification" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_806993c03d99558f423ec01bbb" ON "property_classification" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1a24aef900f50e1c3abfe53164" ON "property_classification" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fe1614080ee22db893bdfbdeba" ON "property_classification" ("IsDisabled", "Name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "property_type" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, CONSTRAINT "PK_42738d19919401b9fe08ccdd4e2" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_719b4bbf3b93a649f5ef90d968" ON "property_type" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6d34de8157955f540f198dbc61" ON "property_type" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cd7711c358add04632676cd4cf" ON "property_type" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d1d9ae93b704c63e33ed6ebbfc" ON "property_type" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(250), "Description" character varying(2000), "ClassificationId" integer NOT NULL, "AgencyId" integer, "AdministrativeAreaId" integer NOT NULL, "IsSensitive" boolean NOT NULL, "IsVisibleToOtherAgencies" boolean NOT NULL, "Location" point NOT NULL, "ProjectNumbers" character varying(2000), "PropertyTypeId" integer NOT NULL, "Address1" character varying(150), "Address2" character varying(150), "Postal" character varying(6), "SiteId" character varying, "BuildingConstructionTypeId" integer NOT NULL, "BuildingFloorCount" integer NOT NULL, "BuildingPredominateUseId" integer NOT NULL, "BuildingTenancy" character varying(450) NOT NULL, "RentableArea" real NOT NULL, "BuildingOccupantTypeId" integer NOT NULL, "LeaseExpiry" TIMESTAMP, "OccupantName" character varying(100), "TransferLeaseOnSale" boolean NOT NULL, "BuildingTenancyUpdatedOn" TIMESTAMP, "EncumbranceReason" character varying(500), "LeasedLandMetadata" character varying(2000), "TotalArea" real NOT NULL, CONSTRAINT "PK_b2aab00b122c9bbf60ad12e1750" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1db6127f236406fbd224404a56" ON "building" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ecbf2cc6d83ab02e2495f354f7" ON "building" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6bec46322ae9b4fdc1712ab65e" ON "building" ("ClassificationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_660f6a82c58715ccb3e939bec9" ON "building" ("AgencyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e1c368b69fe6d55fb899d4b09f" ON "building" ("AdministrativeAreaId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6774c5af0daf3a6f910a4aa042" ON "building" ("PropertyTypeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b3f209b9a4ee05a9eb9ec58fe5" ON "building" ("Address1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ae155b8e2213e901180f54ba4" ON "building" ("BuildingConstructionTypeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5b3ee7013349be96c40cb9cfd" ON "building" ("BuildingPredominateUseId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0dc5a69385e011b026cf9349a2" ON "building" ("BuildingOccupantTypeId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "evaluation_key" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "Description" text, CONSTRAINT "PK_704bb2dafbc4b3136fecad4b083" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f96c0877bd6385eac3ba1f2c78" ON "evaluation_key" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_839b7cb82690afe5a15c035b08" ON "evaluation_key" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bc8c2c506f8cc061b0e3380eb1" ON "evaluation_key" ("Name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_evaluation" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Date" TIMESTAMP NOT NULL, "EvaluationKeyId" integer NOT NULL, "Value" money NOT NULL, "Note" character varying(500), "BuildingId" integer NOT NULL, CONSTRAINT "PK_861291d0fcbce13f6d2490bef2e" PRIMARY KEY ("Date", "EvaluationKeyId", "BuildingId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56aeba3df852659e336883e93d" ON "building_evaluation" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6da6cc15cd660f17f8d5f4b872" ON "building_evaluation" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9c6b73e6e1191c475083a1d5fd" ON "building_evaluation" ("BuildingId", "EvaluationKeyId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "fiscal_key" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "Description" text, CONSTRAINT "PK_191f9983601710a803b6f23df4b" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_448cedce8da97154c0238de097" ON "fiscal_key" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98a4cb83be360a5a1a284d58e4" ON "fiscal_key" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fe77a224958124b56f0258febb" ON "fiscal_key" ("Name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "building_fiscal" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "FiscalYear" integer NOT NULL, "FiscalKeyId" integer NOT NULL, "Value" money NOT NULL, "Note" text, "EffectiveDate" TIMESTAMP, "BuildingId" integer NOT NULL, CONSTRAINT "PK_a7e294fbf4517f9de59ec34ece1" PRIMARY KEY ("FiscalYear", "FiscalKeyId", "BuildingId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caf56f353cb0d8ae6bd750a0c4" ON "building_fiscal" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4449ca75afd996e3044832bb0" ON "building_fiscal" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c1a58bed256b7b2a5f15509a3" ON "building_fiscal" ("FiscalYear", "FiscalKeyId", "Value") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fab667986554eb11aac2b87caa" ON "building_fiscal" ("BuildingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_status" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" integer NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "Code" character varying(10) NOT NULL, "GroupName" character varying(150), "Description" text, "IsMilestone" boolean NOT NULL, "IsTerminal" boolean NOT NULL, "Route" character varying(150) NOT NULL, CONSTRAINT "PK_9c7c93e46ce16c137c062b26e85" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dfa98ba50e790bc7b17248fa20" ON "project_status" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5ece525a0b4612005a76d0110e" ON "project_status" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d42b1950f600f2ba10a1073c37" ON "project_status" ("Code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_88b12d599bddadf5cf7ed7ca6c" ON "project_status" ("IsDisabled", "Name", "Code", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" integer NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "Code" character varying(20) NOT NULL, "Description" text, CONSTRAINT "PK_7f2e96be61bf3a880ce026ba746" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_120d2981d695242d3126b2ecf3" ON "workflow" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7cbf3bb5d2b807ac35197acc7e" ON "workflow" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fdbbf5ddd085c931b2b9a597c8" ON "workflow" ("Name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1ee68d46c647bbd30af0655406" ON "workflow" ("Code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68176849c7a540b890086c2482" ON "workflow" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "tier_level" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "Description" text, CONSTRAINT "PK_6ffd34233549c06caf7f2bc3b97" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a3f38c658f937940d6e744e2b" ON "tier_level" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d81d7fa7dd028492b040b99f8a" ON "tier_level" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_55ff7ee85ea69072a47da1d158" ON "tier_level" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_485d32d02c154922086bf9f604" ON "tier_level" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_risk" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "Code" character varying(10) NOT NULL, "Description" text, CONSTRAINT "PK_2580496ee836d459722c75722ff" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_826e688fee211771c9b0f5e3a2" ON "project_risk" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d2429392781e2bbd3e707d5cbb" ON "project_risk" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8e81515c1554b7fe9540a80e9d" ON "project_risk" ("Code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0bf9c3491d0f50a52d4874a5b4" ON "project_risk" ("IsDisabled", "Code", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "ProjectNumber" character varying(25) NOT NULL, "Name" character varying(100) NOT NULL, "Manager" character varying(150), "ReportedFiscalYear" integer NOT NULL, "ActualFiscalYear" integer NOT NULL, "Description" text, "Metadata" text, "SubmittedOn" TIMESTAMP, "ApprovedOn" TIMESTAMP, "DeniedOn" TIMESTAMP, "CancelledOn" TIMESTAMP, "CompletedOn" TIMESTAMP, "NetBook" money, "Market" money, "Assessed" money, "Appraised" money, "ProjectType" integer NOT NULL, "WorkflowId" integer NOT NULL, "AgencyId" integer NOT NULL, "TierLevelId" integer NOT NULL, "StatusId" integer NOT NULL, "RiskId" integer NOT NULL, CONSTRAINT "PK_7f2c2f1af4879a4af2dabc43b59" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_92edd522e47ae4b0c32fd5ec79" ON "project" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eebf4f4b257d3c54b29cc8612a" ON "project" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_af9dfc9e21f85cf3d6e7b3f364" ON "project" ("ProjectNumber") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36d8a4897455038c86fe864b56" ON "project" ("WorkflowId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7687de6e695cb7f4bd9c2c9f75" ON "project" ("AgencyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8a2d7000e930610fcff4518b5" ON "project" ("TierLevelId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e5ce48d7c645fe89c026dc183" ON "project" ("StatusId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d8b0999e9c0eca839ebc9f044" ON "project" ("RiskId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_92ae926b277011146b34e7c63d" ON "project" ("StatusId", "TierLevelId", "AgencyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_62bf88fe0fbad2490568a3464e" ON "project" ("Assessed", "NetBook", "Market", "ReportedFiscalYear", "ActualFiscalYear") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_template" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(100) NOT NULL, "Description" text, "To" character varying(500), "Cc" character varying(500), "Bcc" character varying(500), "Audience" character varying(50) NOT NULL, "Encoding" character varying(50) NOT NULL, "BodyType" character varying(50) NOT NULL, "Priority" character varying(50) NOT NULL, "Subject" character varying(200) NOT NULL, "Body" text, "IsDisabled" boolean NOT NULL, "Tag" character varying(50), CONSTRAINT "PK_2f34a8ce654a891a88b508ef329" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c0604eb0c437f557e473e80f83" ON "notification_template" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1dd63279a1fc0216a61f2d4cc5" ON "notification_template" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6b2b9d8f3db40276ccf3751645" ON "notification_template" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3393387f688ba9899d39f93f5f" ON "notification_template" ("IsDisabled", "Tag") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_queue" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Key" uuid NOT NULL, "Status" integer NOT NULL, "Priority" character varying(50) NOT NULL, "Encoding" character varying(50) NOT NULL, "SendOn" TIMESTAMP NOT NULL, "To" character varying(500), "Subject" character varying(200) NOT NULL, "BodyType" character varying(50) NOT NULL, "Body" text NOT NULL, "Bcc" character varying(500), "Cc" character varying(500), "Tag" character varying(50), "ProjectId" integer NOT NULL, "ToAgencyId" integer NOT NULL, "TemplateId" integer NOT NULL, "ChesMessageId" uuid NOT NULL, "ChesTransactionId" uuid NOT NULL, CONSTRAINT "PK_0fbce80fc625ae6af8f2c05f18a" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ada44a71f0c630ba3a6360dfd7" ON "notification_queue" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68870a847392c566965ee40b00" ON "notification_queue" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b1a1fb67dbbe84787e9836745d" ON "notification_queue" ("Key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_705c9558182adb03383285e867" ON "notification_queue" ("ToAgencyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f4fd4ee805c533caaf891556c" ON "notification_queue" ("TemplateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_359a7aedcd7b3d97fda4bfbc83" ON "notification_queue" ("ProjectId", "TemplateId", "ToAgencyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d201b60436282e54dc2f4a5900" ON "notification_queue" ("Status", "SendOn", "Subject") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parcel" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(250), "Description" character varying(2000), "ClassificationId" integer NOT NULL, "AgencyId" integer, "AdministrativeAreaId" integer NOT NULL, "IsSensitive" boolean NOT NULL, "IsVisibleToOtherAgencies" boolean NOT NULL, "Location" point NOT NULL, "ProjectNumbers" character varying(2000), "PropertyTypeId" integer NOT NULL, "Address1" character varying(150), "Address2" character varying(150), "Postal" character varying(6), "SiteId" character varying, "PID" integer NOT NULL, "PIN" integer, "LandArea" real, "LandLegalDescription" character varying(500), "Zoning" character varying(50), "ZoningPotential" character varying(50), "NotOwned" boolean NOT NULL, "ParentParcelId" integer, CONSTRAINT "PK_a1c1300daf57406ab4f1bf44485" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a287500cc1c1e800e47308bfbb" ON "parcel" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d0744d5e33373639336bb921d" ON "parcel" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8c7de899d6823ce867d84e9a5a" ON "parcel" ("ClassificationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_24abde90040d45d682843e5c6f" ON "parcel" ("AgencyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1afa8aa2564a147b63a239ba7b" ON "parcel" ("AdministrativeAreaId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff2eb544d938698a090740bf4f" ON "parcel" ("PropertyTypeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_37cd8e04f7b073c98d969df0dc" ON "parcel" ("Address1") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f9c9b5645952970fe04184d7f3" ON "parcel" ("PID", "PIN") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parcel_building" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "ParcelId" integer NOT NULL, "BuildingId" integer NOT NULL, CONSTRAINT "PK_92ef502c853d0bcbc5aee50b5dd" PRIMARY KEY ("ParcelId", "BuildingId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c24503d777690b738ce323bce" ON "parcel_building" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_774b5c510271eee240e596d980" ON "parcel_building" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parcel_fiscal" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "FiscalYear" integer NOT NULL, "FiscalKeyId" integer NOT NULL, "Value" money NOT NULL, "Note" text, "EffectiveDate" TIMESTAMP, "ParcelId" integer NOT NULL, CONSTRAINT "PK_5bf971f7c71f9d25832fd5bd2be" PRIMARY KEY ("FiscalYear", "FiscalKeyId", "ParcelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87fc04dbccafd0b564a2b214fa" ON "parcel_fiscal" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_137c389c35d117bd3b57bb3758" ON "parcel_fiscal" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18f77928db510eb6963cb69976" ON "parcel_fiscal" ("FiscalYear", "FiscalKeyId", "Value") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_02f45f04c7279bb629c1c7eb57" ON "parcel_fiscal" ("ParcelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_note" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "ProjectId" integer NOT NULL, "NoteType" integer NOT NULL, "Note" text NOT NULL, CONSTRAINT "PK_a0bbe1971e80c671f06aa55d818" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4854a8bb51b552c0374014a15" ON "project_note" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_26e9b340be9a220d82ac75aba8" ON "project_note" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_590ffa664889a289918f618e0a" ON "project_note" ("ProjectId", "NoteType") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_number" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, CONSTRAINT "PK_50eaef0eef63fe2e5e899aad357" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f480fcefbb14d128759fec0651" ON "project_number" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_16ea8abe722621a10ac15db084" ON "project_number" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE TABLE "report_type" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(20) NOT NULL, "Description" text, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, CONSTRAINT "PK_2d1fa50743a4da4d2ece0802cbe" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc099fee4ada0ae3dc7fda3774" ON "report_type" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_afbac675a610832f932c2df659" ON "report_type" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2236bb453b025c144a12dd42e2" ON "report_type" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_214853469dd5c1b77e0ab3b0b7" ON "report_type" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_report" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "IsFinal" boolean NOT NULL, "Name" character varying(250), "From" TIMESTAMP NOT NULL, "To" TIMESTAMP NOT NULL, "ReportTypeId" integer NOT NULL, CONSTRAINT "PK_4868796169d109a4adea7d8ecc6" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8a9eaf80d836df0b31de6a02eb" ON "project_report" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc8f6da014c702e1205ff5e7fc" ON "project_report" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c32ecc1c2fd813140954bdfcc0" ON "project_report" ("Id", "To", "From", "IsFinal") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_property" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "ProjectId" integer NOT NULL, "PropertyTypeId" integer NOT NULL, "ParcelId" integer NOT NULL, "BuildingId" integer NOT NULL, CONSTRAINT "PK_1696fd8354a197fc5456a88e580" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bd0411b25b82012ecee5bc250e" ON "project_property" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db82efd607917822803ea51c31" ON "project_property" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a8615c36638af5cbe405f58fca" ON "project_property" ("ProjectId", "PropertyTypeId", "ParcelId", "BuildingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_status_history" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "ProjectId" integer NOT NULL, "WorkflowId" integer NOT NULL, "StatusId" integer NOT NULL, CONSTRAINT "PK_8f45e0fdfdc74760fb330d846f5" PRIMARY KEY ("Id", "ProjectId", "WorkflowId", "StatusId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b2b0eec46d15f7972b8adba09" ON "project_status_history" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3032f4f9c067dd90d51806594" ON "project_status_history" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f759d96ffccada1ec97f9db817" ON "project_status_history" ("ProjectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b30c21a3bb1cadbf654d2e860a" ON "project_status_history" ("WorkflowId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_01f0894feba7f37f8185731d9f" ON "project_status_history" ("StatusId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_agency_response" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "ProjectId" integer NOT NULL, "AgencyId" integer NOT NULL, "OfferAmount" money NOT NULL, "NotificationId" integer NOT NULL, "Response" integer NOT NULL, "ReceivedOn" TIMESTAMP, "Note" character varying(2000), CONSTRAINT "PK_646db5471098979a3611b431222" PRIMARY KEY ("ProjectId", "AgencyId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2676ffafe4d84043a69b290cfe" ON "project_agency_response" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d04beec26b2444d9cde212811c" ON "project_agency_response" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14fa612dd1f3ac554faa62f7ff" ON "project_agency_response" ("NotificationId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_status_transition" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "FromWorkflowId" integer NOT NULL, "FromStatusId" integer NOT NULL, "ToWorkflowId" integer NOT NULL, "ToStatusId" integer NOT NULL, "Action" character varying(100) NOT NULL, "ValidateTasks" boolean NOT NULL, CONSTRAINT "PK_3c62ad86eeeaed7e0a172a48ab0" PRIMARY KEY ("FromWorkflowId", "FromStatusId", "ToWorkflowId", "ToStatusId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1011dc0123d14c06a9bddcdc2e" ON "project_status_transition" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_206a2108332afbff74c914a07e" ON "project_status_transition" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10d5e3b7c4f3412bf6ba82f1fb" ON "project_status_transition" ("FromWorkflowId", "FromStatusId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b9dda79f47cc16dd6f95685a11" ON "project_status_transition" ("ToWorkflowId", "ToStatusId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_status_notification" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "TemplateId" integer NOT NULL, "FromStatusId" integer, "ToStatusId" integer NOT NULL, "Priority" integer NOT NULL, "Delay" integer NOT NULL, "DelayDays" integer NOT NULL, CONSTRAINT "PK_491d6520b436682e61f61e019aa" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_deaf61da2a9bfe0cc7fd3e1397" ON "project_status_notification" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f23b704bea34701da9938654dd" ON "project_status_notification" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c42bdbdc9aa6ff04dca365d437" ON "project_status_notification" ("TemplateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4c0c9f1bfe8cd1bb26d85f9b6" ON "project_status_notification" ("ToStatusId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5eb37214b16fa6d7416ca18440" ON "project_status_notification" ("FromStatusId", "ToStatusId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(150) NOT NULL, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, "Description" text, "IsOptional" boolean NOT NULL, "StatusId" integer NOT NULL, CONSTRAINT "PK_50bde4df67295bf27cd0b7abe99" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4ea2ad32ccbacc339a4fb1d4db" ON "task" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_78544bfd6310d7e2dc71d57b56" ON "task" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d226bbfd3fb32ef2f3ee6f130" ON "task" ("IsDisabled", "IsOptional", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_task" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "ProjectId" integer NOT NULL, "TaskId" integer NOT NULL, "IsCompleted" boolean NOT NULL, "CompletedOn" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_4bb5ea7cc99bc65db2362bd47d0" PRIMARY KEY ("ProjectId", "TaskId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d19de58ad17f53726333c89fb" ON "project_task" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de4567ac4ab366bb6635ea0d77" ON "project_task" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32343aaa24f49813b1b8403da8" ON "project_task" ("TaskId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6d31cdb891c6f707147fcec806" ON "project_task" ("ProjectId", "TaskId", "IsCompleted", "CompletedOn") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_snapshot" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "ProjectId" integer NOT NULL, "NetBook" money, "Market" money, "Assessed" money, "Appraised" money, "SnapshotOn" TIMESTAMP NOT NULL, "Metadata" text, CONSTRAINT "PK_caa45e3416441b86e0de14332fa" PRIMARY KEY ("Id", "ProjectId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_72344b23c60662302ef496fd01" ON "project_snapshot" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f49593821acb73e3f3f5c75f1" ON "project_snapshot" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d2b08c043730267d30bfe38fee" ON "project_snapshot" ("ProjectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_30c723e97dd7fd9577c216e4a3" ON "project_snapshot" ("ProjectId", "SnapshotOn") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parcel_evaluation" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Date" TIMESTAMP NOT NULL, "EvaluationKeyId" integer NOT NULL, "Value" money NOT NULL, "Note" character varying(500), "ParcelId" integer NOT NULL, "Firm" character varying(150), CONSTRAINT "PK_555a6a78040868faa2527607eff" PRIMARY KEY ("Date", "EvaluationKeyId", "ParcelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd245945881a8d0428a37bed61" ON "parcel_evaluation" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bb8dd863a2b8f363514051792c" ON "parcel_evaluation" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_116fc313f83129cb2266a36f41" ON "parcel_evaluation" ("ParcelId", "EvaluationKeyId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_type" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "Id" SERIAL NOT NULL, "Name" character varying(20) NOT NULL, "Description" text, "IsDisabled" boolean NOT NULL, "SortOrder" integer NOT NULL, CONSTRAINT "PK_98761b1910c29a664aa37287268" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f440e962cc2653a3cd830b60b4" ON "project_type" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_566c876e0679480e2a99fa83e4" ON "project_type" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9758554732342b0a696a971085" ON "project_type" ("Name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c5f2f52407347e0b7a54996821" ON "project_type" ("IsDisabled", "Name", "SortOrder") `,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow_project_status" ("CreatedById" uuid NOT NULL, "CreatedOn" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedById" uuid, "UpdatedOn" TIMESTAMP, "WorkflowId" integer NOT NULL, "StatusId" integer NOT NULL, "SortOrder" integer NOT NULL, "IsOptional" boolean NOT NULL, CONSTRAINT "PK_a7b19095278ab398e21555f9b1e" PRIMARY KEY ("WorkflowId", "StatusId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a1574cf9168ed1f4a1c4eaa8d" ON "workflow_project_status" ("CreatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d67fa6bf65e80a14dc7e0c6f8f" ON "workflow_project_status" ("UpdatedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9fc2b51bf70dfc6969f9b04934" ON "workflow_project_status" ("WorkflowId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2050f19a4c73eb00e7778612d3" ON "workflow_project_status" ("StatusId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" ADD CONSTRAINT "FK_57fd74ea1b8a1b0d85e1c7ad206" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" ADD CONSTRAINT "FK_4087b9d814a4a90af734b6dd3a8" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" ADD CONSTRAINT "FK_89544ece79ad52653c8fce606bd" FOREIGN KEY ("ParentId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_051c6dcae604d9286f20cc2d76d" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_0a24ac662369d88db55649f3e5a" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_061257d343976f0dd80167c79ee" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_cdcb63fdec2cdf48ea4589557dc" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_5c8d47a21865d7a468c4f60ede5" FOREIGN KEY ("ApprovedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b56b7c6b8530bf7369d9bdbd19b" FOREIGN KEY ("AgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_27f6f4b16a19bf5384ac8a11ca1" FOREIGN KEY ("RoleId") REFERENCES "role"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" ADD CONSTRAINT "FK_c3e2e1bb170870974db5ce848f8" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" ADD CONSTRAINT "FK_0f567e907073e1bf5af072410c2" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" ADD CONSTRAINT "FK_352664edaa51c51a3f62d1cd8a6" FOREIGN KEY ("UserId") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" ADD CONSTRAINT "FK_952464b169add4b0f13a4401ef9" FOREIGN KEY ("RoleId") REFERENCES "role"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" ADD CONSTRAINT "FK_f8eab68887703533b9ec5656b64" FOREIGN KEY ("AgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ADD CONSTRAINT "FK_3bf46797647574d5aeb8122a5a5" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" ADD CONSTRAINT "FK_6744ccd2014fd4e757094104150" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ADD CONSTRAINT "FK_09f8f34216ccfffd99add293598" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" ADD CONSTRAINT "FK_c40ce91f4fff8b30bc116e66d54" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ADD CONSTRAINT "FK_a6adc6a5b01c4024621c52b1a27" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" ADD CONSTRAINT "FK_088d32f15fd51a4eee07cdde285" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" ADD CONSTRAINT "FK_336d5c7c816dc621dbc820cc2a7" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" ADD CONSTRAINT "FK_d8f11c563f58d60c57c96b7b830" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" ADD CONSTRAINT "FK_ff339e05eab922546e009f6cc7f" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" ADD CONSTRAINT "FK_9d396303fe83e044d69531b1283" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_8d89023b6b9a759bee9ba30d085" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_68d342e36be4fc4f78d1d943c1c" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_09ecbd0495a18dd9c5648e6ede3" FOREIGN KEY ("RegionalDistrictId") REFERENCES "regional_district"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" ADD CONSTRAINT "FK_af5f23834c3bd813da5cd195da7" FOREIGN KEY ("ProvinceId") REFERENCES "province"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ADD CONSTRAINT "FK_0995f092c645d5412712204fa0c" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" ADD CONSTRAINT "FK_806993c03d99558f423ec01bbb2" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" ADD CONSTRAINT "FK_719b4bbf3b93a649f5ef90d968b" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" ADD CONSTRAINT "FK_6d34de8157955f540f198dbc61d" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_1db6127f236406fbd224404a568" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_ecbf2cc6d83ab02e2495f354f75" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_6bec46322ae9b4fdc1712ab65e5" FOREIGN KEY ("ClassificationId") REFERENCES "property_classification"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_660f6a82c58715ccb3e939bec9d" FOREIGN KEY ("AgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_e1c368b69fe6d55fb899d4b09f3" FOREIGN KEY ("AdministrativeAreaId") REFERENCES "administrative_area"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_6774c5af0daf3a6f910a4aa042c" FOREIGN KEY ("PropertyTypeId") REFERENCES "property_type"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_8ae155b8e2213e901180f54ba4e" FOREIGN KEY ("BuildingConstructionTypeId") REFERENCES "building_construction_type"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_a5b3ee7013349be96c40cb9cfd2" FOREIGN KEY ("BuildingPredominateUseId") REFERENCES "building_predominate_use"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" ADD CONSTRAINT "FK_0dc5a69385e011b026cf9349a2d" FOREIGN KEY ("BuildingOccupantTypeId") REFERENCES "building_occupant_type"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" ADD CONSTRAINT "FK_f96c0877bd6385eac3ba1f2c78d" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" ADD CONSTRAINT "FK_839b7cb82690afe5a15c035b089" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_56aeba3df852659e336883e93d0" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_6da6cc15cd660f17f8d5f4b8727" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_eeecf4e694ba6dff606c907b2a4" FOREIGN KEY ("EvaluationKeyId") REFERENCES "evaluation_key"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" ADD CONSTRAINT "FK_3e9ac5c77dbf16ff2d5a3e028c4" FOREIGN KEY ("BuildingId") REFERENCES "building"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" ADD CONSTRAINT "FK_448cedce8da97154c0238de097d" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" ADD CONSTRAINT "FK_98a4cb83be360a5a1a284d58e4a" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_caf56f353cb0d8ae6bd750a0c4f" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_e4449ca75afd996e3044832bb02" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_c0a52b1dea77ff6d3c704fcc473" FOREIGN KEY ("FiscalKeyId") REFERENCES "fiscal_key"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" ADD CONSTRAINT "FK_fab667986554eb11aac2b87caa4" FOREIGN KEY ("BuildingId") REFERENCES "building"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" ADD CONSTRAINT "FK_dfa98ba50e790bc7b17248fa204" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" ADD CONSTRAINT "FK_5ece525a0b4612005a76d0110e3" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" ADD CONSTRAINT "FK_120d2981d695242d3126b2ecf31" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" ADD CONSTRAINT "FK_7cbf3bb5d2b807ac35197acc7eb" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" ADD CONSTRAINT "FK_6a3f38c658f937940d6e744e2bb" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" ADD CONSTRAINT "FK_d81d7fa7dd028492b040b99f8aa" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" ADD CONSTRAINT "FK_826e688fee211771c9b0f5e3a2c" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" ADD CONSTRAINT "FK_d2429392781e2bbd3e707d5cbb2" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_92edd522e47ae4b0c32fd5ec795" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_eebf4f4b257d3c54b29cc8612a5" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_36d8a4897455038c86fe864b563" FOREIGN KEY ("WorkflowId") REFERENCES "workflow"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_7687de6e695cb7f4bd9c2c9f75d" FOREIGN KEY ("AgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_c8a2d7000e930610fcff4518b5d" FOREIGN KEY ("TierLevelId") REFERENCES "tier_level"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_8e5ce48d7c645fe89c026dc1835" FOREIGN KEY ("StatusId") REFERENCES "project_status"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_8d8b0999e9c0eca839ebc9f044c" FOREIGN KEY ("RiskId") REFERENCES "project_risk"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" ADD CONSTRAINT "FK_c0604eb0c437f557e473e80f830" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" ADD CONSTRAINT "FK_1dd63279a1fc0216a61f2d4cc5f" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_ada44a71f0c630ba3a6360dfd79" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_68870a847392c566965ee40b008" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_5d7fe381cc5ac14b88f911c81c7" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_705c9558182adb03383285e8674" FOREIGN KEY ("ToAgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" ADD CONSTRAINT "FK_1f4fd4ee805c533caaf891556c9" FOREIGN KEY ("TemplateId") REFERENCES "notification_template"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_a287500cc1c1e800e47308bfbb0" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_8d0744d5e33373639336bb921d0" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_8c7de899d6823ce867d84e9a5ac" FOREIGN KEY ("ClassificationId") REFERENCES "property_classification"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_24abde90040d45d682843e5c6ff" FOREIGN KEY ("AgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_1afa8aa2564a147b63a239ba7b5" FOREIGN KEY ("AdministrativeAreaId") REFERENCES "administrative_area"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_ff2eb544d938698a090740bf4fd" FOREIGN KEY ("PropertyTypeId") REFERENCES "property_type"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" ADD CONSTRAINT "FK_5b4217d1382b7617cd4e70ec6b4" FOREIGN KEY ("ParentParcelId") REFERENCES "parcel"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" ADD CONSTRAINT "FK_7c24503d777690b738ce323bce0" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" ADD CONSTRAINT "FK_774b5c510271eee240e596d9808" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" ADD CONSTRAINT "FK_e7be5fdaaf9a64fe00018fe5dd5" FOREIGN KEY ("ParcelId") REFERENCES "parcel"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" ADD CONSTRAINT "FK_e37f8c948a2f75bc7e2c5e510ec" FOREIGN KEY ("BuildingId") REFERENCES "building"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_87fc04dbccafd0b564a2b214fad" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_137c389c35d117bd3b57bb37585" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_a7b9e967f857dbc908deab2f5f1" FOREIGN KEY ("FiscalKeyId") REFERENCES "fiscal_key"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" ADD CONSTRAINT "FK_02f45f04c7279bb629c1c7eb573" FOREIGN KEY ("ParcelId") REFERENCES "parcel"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_e4854a8bb51b552c0374014a158" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_26e9b340be9a220d82ac75aba89" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" ADD CONSTRAINT "FK_92d54e65849fc820dd9deb639cc" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" ADD CONSTRAINT "FK_f480fcefbb14d128759fec06512" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" ADD CONSTRAINT "FK_16ea8abe722621a10ac15db0846" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" ADD CONSTRAINT "FK_dc099fee4ada0ae3dc7fda3774e" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" ADD CONSTRAINT "FK_afbac675a610832f932c2df6597" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" ADD CONSTRAINT "FK_8a9eaf80d836df0b31de6a02eba" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" ADD CONSTRAINT "FK_cc8f6da014c702e1205ff5e7fce" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" ADD CONSTRAINT "FK_e74f1589521cb0f15f9c771dbc3" FOREIGN KEY ("ReportTypeId") REFERENCES "report_type"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_bd0411b25b82012ecee5bc250e6" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_db82efd607917822803ea51c31c" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_c59f0cbb17fe28d04ad0c7774c5" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_cf8d98786c1247322b0072817b9" FOREIGN KEY ("PropertyTypeId") REFERENCES "property_type"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_a580df432f0e0c521225fc3327b" FOREIGN KEY ("ParcelId") REFERENCES "parcel"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" ADD CONSTRAINT "FK_de366a792fc0aef4f8718e42d9c" FOREIGN KEY ("BuildingId") REFERENCES "building"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_7b2b0eec46d15f7972b8adba092" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_f3032f4f9c067dd90d51806594a" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_f759d96ffccada1ec97f9db817d" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_b30c21a3bb1cadbf654d2e860a1" FOREIGN KEY ("WorkflowId") REFERENCES "workflow"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" ADD CONSTRAINT "FK_01f0894feba7f37f8185731d9fb" FOREIGN KEY ("StatusId") REFERENCES "project_status"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_2676ffafe4d84043a69b290cfef" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_d04beec26b2444d9cde212811c7" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_d8543ae1a734af9d06bef9a42be" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_a7d3d7245bbe7886ca54f791940" FOREIGN KEY ("AgencyId") REFERENCES "agency"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" ADD CONSTRAINT "FK_14fa612dd1f3ac554faa62f7ff9" FOREIGN KEY ("NotificationId") REFERENCES "notification_queue"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_1011dc0123d14c06a9bddcdc2e9" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_206a2108332afbff74c914a07ef" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_debb730c841395857d2ce6fc4e8" FOREIGN KEY ("FromWorkflowId") REFERENCES "workflow"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_c8badedb6cba0265b076a2eb0f8" FOREIGN KEY ("FromStatusId") REFERENCES "project_status"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_72d2cc0ef534734b4822456e4ef" FOREIGN KEY ("ToWorkflowId") REFERENCES "workflow"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" ADD CONSTRAINT "FK_1fc9664e25d9592bc6f59604197" FOREIGN KEY ("ToStatusId") REFERENCES "project_status"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_deaf61da2a9bfe0cc7fd3e13971" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_f23b704bea34701da9938654dde" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_c42bdbdc9aa6ff04dca365d437e" FOREIGN KEY ("TemplateId") REFERENCES "notification_template"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_028f154ba333fae04bd0d1809e7" FOREIGN KEY ("FromStatusId") REFERENCES "project_status"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" ADD CONSTRAINT "FK_d4c0c9f1bfe8cd1bb26d85f9b6d" FOREIGN KEY ("ToStatusId") REFERENCES "project_status"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_4ea2ad32ccbacc339a4fb1d4db8" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_78544bfd6310d7e2dc71d57b565" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_34feaa99b96dc1b9a12cd75b45e" FOREIGN KEY ("StatusId") REFERENCES "project_status"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_3d19de58ad17f53726333c89fb1" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_de4567ac4ab366bb6635ea0d77a" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_a5819864ef8931ee93ae00cc620" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_32343aaa24f49813b1b8403da87" FOREIGN KEY ("TaskId") REFERENCES "task"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_72344b23c60662302ef496fd013" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_7f49593821acb73e3f3f5c75f17" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_d2b08c043730267d30bfe38feeb" FOREIGN KEY ("ProjectId") REFERENCES "project"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_dd245945881a8d0428a37bed615" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_bb8dd863a2b8f363514051792c5" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_a95bea21af2bf47c50ef9e97306" FOREIGN KEY ("EvaluationKeyId") REFERENCES "evaluation_key"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" ADD CONSTRAINT "FK_88484fcafeb6f3ece533c9bd959" FOREIGN KEY ("ParcelId") REFERENCES "parcel"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" ADD CONSTRAINT "FK_f440e962cc2653a3cd830b60b46" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" ADD CONSTRAINT "FK_566c876e0679480e2a99fa83e4a" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_9a1574cf9168ed1f4a1c4eaa8d7" FOREIGN KEY ("CreatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_d67fa6bf65e80a14dc7e0c6f8ff" FOREIGN KEY ("UpdatedById") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_9fc2b51bf70dfc6969f9b049343" FOREIGN KEY ("WorkflowId") REFERENCES "workflow"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" ADD CONSTRAINT "FK_2050f19a4c73eb00e7778612d37" FOREIGN KEY ("StatusId") REFERENCES "project_status"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_2050f19a4c73eb00e7778612d37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_9fc2b51bf70dfc6969f9b049343"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_d67fa6bf65e80a14dc7e0c6f8ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_project_status" DROP CONSTRAINT "FK_9a1574cf9168ed1f4a1c4eaa8d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" DROP CONSTRAINT "FK_566c876e0679480e2a99fa83e4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_type" DROP CONSTRAINT "FK_f440e962cc2653a3cd830b60b46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_88484fcafeb6f3ece533c9bd959"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_a95bea21af2bf47c50ef9e97306"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_bb8dd863a2b8f363514051792c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_evaluation" DROP CONSTRAINT "FK_dd245945881a8d0428a37bed615"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_d2b08c043730267d30bfe38feeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_7f49593821acb73e3f3f5c75f17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_72344b23c60662302ef496fd013"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_32343aaa24f49813b1b8403da87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_a5819864ef8931ee93ae00cc620"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_de4567ac4ab366bb6635ea0d77a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_3d19de58ad17f53726333c89fb1"`,
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_34feaa99b96dc1b9a12cd75b45e"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_78544bfd6310d7e2dc71d57b565"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_4ea2ad32ccbacc339a4fb1d4db8"`);
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_d4c0c9f1bfe8cd1bb26d85f9b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_028f154ba333fae04bd0d1809e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_c42bdbdc9aa6ff04dca365d437e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_f23b704bea34701da9938654dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_notification" DROP CONSTRAINT "FK_deaf61da2a9bfe0cc7fd3e13971"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_1fc9664e25d9592bc6f59604197"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_72d2cc0ef534734b4822456e4ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_c8badedb6cba0265b076a2eb0f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_debb730c841395857d2ce6fc4e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_206a2108332afbff74c914a07ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_transition" DROP CONSTRAINT "FK_1011dc0123d14c06a9bddcdc2e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_14fa612dd1f3ac554faa62f7ff9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_a7d3d7245bbe7886ca54f791940"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_d8543ae1a734af9d06bef9a42be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_d04beec26b2444d9cde212811c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_agency_response" DROP CONSTRAINT "FK_2676ffafe4d84043a69b290cfef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_01f0894feba7f37f8185731d9fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_b30c21a3bb1cadbf654d2e860a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_f759d96ffccada1ec97f9db817d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_f3032f4f9c067dd90d51806594a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status_history" DROP CONSTRAINT "FK_7b2b0eec46d15f7972b8adba092"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_de366a792fc0aef4f8718e42d9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_a580df432f0e0c521225fc3327b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_cf8d98786c1247322b0072817b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_c59f0cbb17fe28d04ad0c7774c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_db82efd607917822803ea51c31c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_property" DROP CONSTRAINT "FK_bd0411b25b82012ecee5bc250e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" DROP CONSTRAINT "FK_e74f1589521cb0f15f9c771dbc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" DROP CONSTRAINT "FK_cc8f6da014c702e1205ff5e7fce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_report" DROP CONSTRAINT "FK_8a9eaf80d836df0b31de6a02eba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" DROP CONSTRAINT "FK_afbac675a610832f932c2df6597"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_type" DROP CONSTRAINT "FK_dc099fee4ada0ae3dc7fda3774e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" DROP CONSTRAINT "FK_16ea8abe722621a10ac15db0846"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_number" DROP CONSTRAINT "FK_f480fcefbb14d128759fec06512"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_92d54e65849fc820dd9deb639cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_26e9b340be9a220d82ac75aba89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_note" DROP CONSTRAINT "FK_e4854a8bb51b552c0374014a158"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_02f45f04c7279bb629c1c7eb573"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_a7b9e967f857dbc908deab2f5f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_137c389c35d117bd3b57bb37585"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_fiscal" DROP CONSTRAINT "FK_87fc04dbccafd0b564a2b214fad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" DROP CONSTRAINT "FK_e37f8c948a2f75bc7e2c5e510ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" DROP CONSTRAINT "FK_e7be5fdaaf9a64fe00018fe5dd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" DROP CONSTRAINT "FK_774b5c510271eee240e596d9808"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel_building" DROP CONSTRAINT "FK_7c24503d777690b738ce323bce0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_5b4217d1382b7617cd4e70ec6b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_ff2eb544d938698a090740bf4fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_1afa8aa2564a147b63a239ba7b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_24abde90040d45d682843e5c6ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_8c7de899d6823ce867d84e9a5ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_8d0744d5e33373639336bb921d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcel" DROP CONSTRAINT "FK_a287500cc1c1e800e47308bfbb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_1f4fd4ee805c533caaf891556c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_705c9558182adb03383285e8674"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_5d7fe381cc5ac14b88f911c81c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_68870a847392c566965ee40b008"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_queue" DROP CONSTRAINT "FK_ada44a71f0c630ba3a6360dfd79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" DROP CONSTRAINT "FK_1dd63279a1fc0216a61f2d4cc5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_template" DROP CONSTRAINT "FK_c0604eb0c437f557e473e80f830"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_8d8b0999e9c0eca839ebc9f044c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_8e5ce48d7c645fe89c026dc1835"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_c8a2d7000e930610fcff4518b5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_7687de6e695cb7f4bd9c2c9f75d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_36d8a4897455038c86fe864b563"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_eebf4f4b257d3c54b29cc8612a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_92edd522e47ae4b0c32fd5ec795"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" DROP CONSTRAINT "FK_d2429392781e2bbd3e707d5cbb2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_risk" DROP CONSTRAINT "FK_826e688fee211771c9b0f5e3a2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" DROP CONSTRAINT "FK_d81d7fa7dd028492b040b99f8aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tier_level" DROP CONSTRAINT "FK_6a3f38c658f937940d6e744e2bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" DROP CONSTRAINT "FK_7cbf3bb5d2b807ac35197acc7eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" DROP CONSTRAINT "FK_120d2981d695242d3126b2ecf31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" DROP CONSTRAINT "FK_5ece525a0b4612005a76d0110e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_status" DROP CONSTRAINT "FK_dfa98ba50e790bc7b17248fa204"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_fab667986554eb11aac2b87caa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_c0a52b1dea77ff6d3c704fcc473"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_e4449ca75afd996e3044832bb02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_fiscal" DROP CONSTRAINT "FK_caf56f353cb0d8ae6bd750a0c4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" DROP CONSTRAINT "FK_98a4cb83be360a5a1a284d58e4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fiscal_key" DROP CONSTRAINT "FK_448cedce8da97154c0238de097d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_3e9ac5c77dbf16ff2d5a3e028c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_eeecf4e694ba6dff606c907b2a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_6da6cc15cd660f17f8d5f4b8727"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_evaluation" DROP CONSTRAINT "FK_56aeba3df852659e336883e93d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" DROP CONSTRAINT "FK_839b7cb82690afe5a15c035b089"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_key" DROP CONSTRAINT "FK_f96c0877bd6385eac3ba1f2c78d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_0dc5a69385e011b026cf9349a2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_a5b3ee7013349be96c40cb9cfd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_8ae155b8e2213e901180f54ba4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_6774c5af0daf3a6f910a4aa042c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_e1c368b69fe6d55fb899d4b09f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_660f6a82c58715ccb3e939bec9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_6bec46322ae9b4fdc1712ab65e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_ecbf2cc6d83ab02e2495f354f75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building" DROP CONSTRAINT "FK_1db6127f236406fbd224404a568"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" DROP CONSTRAINT "FK_6d34de8157955f540f198dbc61d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_type" DROP CONSTRAINT "FK_719b4bbf3b93a649f5ef90d968b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" DROP CONSTRAINT "FK_806993c03d99558f423ec01bbb2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_classification" DROP CONSTRAINT "FK_0995f092c645d5412712204fa0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_af5f23834c3bd813da5cd195da7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_09ecbd0495a18dd9c5648e6ede3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_68d342e36be4fc4f78d1d943c1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_area" DROP CONSTRAINT "FK_8d89023b6b9a759bee9ba30d085"`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" DROP CONSTRAINT "FK_9d396303fe83e044d69531b1283"`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" DROP CONSTRAINT "FK_ff339e05eab922546e009f6cc7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" DROP CONSTRAINT "FK_d8f11c563f58d60c57c96b7b830"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regional_district" DROP CONSTRAINT "FK_336d5c7c816dc621dbc820cc2a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" DROP CONSTRAINT "FK_088d32f15fd51a4eee07cdde285"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_predominate_use" DROP CONSTRAINT "FK_a6adc6a5b01c4024621c52b1a27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" DROP CONSTRAINT "FK_c40ce91f4fff8b30bc116e66d54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_occupant_type" DROP CONSTRAINT "FK_09f8f34216ccfffd99add293598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" DROP CONSTRAINT "FK_6744ccd2014fd4e757094104150"`,
    );
    await queryRunner.query(
      `ALTER TABLE "building_construction_type" DROP CONSTRAINT "FK_3bf46797647574d5aeb8122a5a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" DROP CONSTRAINT "FK_f8eab68887703533b9ec5656b64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" DROP CONSTRAINT "FK_952464b169add4b0f13a4401ef9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" DROP CONSTRAINT "FK_352664edaa51c51a3f62d1cd8a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" DROP CONSTRAINT "FK_0f567e907073e1bf5af072410c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_request" DROP CONSTRAINT "FK_c3e2e1bb170870974db5ce848f8"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_27f6f4b16a19bf5384ac8a11ca1"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b56b7c6b8530bf7369d9bdbd19b"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5c8d47a21865d7a468c4f60ede5"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cdcb63fdec2cdf48ea4589557dc"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_061257d343976f0dd80167c79ee"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_0a24ac662369d88db55649f3e5a"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_051c6dcae604d9286f20cc2d76d"`);
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_89544ece79ad52653c8fce606bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_4087b9d814a4a90af734b6dd3a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agency" DROP CONSTRAINT "FK_57fd74ea1b8a1b0d85e1c7ad206"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_2050f19a4c73eb00e7778612d3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9fc2b51bf70dfc6969f9b04934"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d67fa6bf65e80a14dc7e0c6f8f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9a1574cf9168ed1f4a1c4eaa8d"`);
    await queryRunner.query(`DROP TABLE "workflow_project_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c5f2f52407347e0b7a54996821"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9758554732342b0a696a971085"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_566c876e0679480e2a99fa83e4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f440e962cc2653a3cd830b60b4"`);
    await queryRunner.query(`DROP TABLE "project_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_116fc313f83129cb2266a36f41"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bb8dd863a2b8f363514051792c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dd245945881a8d0428a37bed61"`);
    await queryRunner.query(`DROP TABLE "parcel_evaluation"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_30c723e97dd7fd9577c216e4a3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d2b08c043730267d30bfe38fee"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7f49593821acb73e3f3f5c75f1"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_72344b23c60662302ef496fd01"`);
    await queryRunner.query(`DROP TABLE "project_snapshot"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6d31cdb891c6f707147fcec806"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_32343aaa24f49813b1b8403da8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_de4567ac4ab366bb6635ea0d77"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3d19de58ad17f53726333c89fb"`);
    await queryRunner.query(`DROP TABLE "project_task"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8d226bbfd3fb32ef2f3ee6f130"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_78544bfd6310d7e2dc71d57b56"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4ea2ad32ccbacc339a4fb1d4db"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5eb37214b16fa6d7416ca18440"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d4c0c9f1bfe8cd1bb26d85f9b6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c42bdbdc9aa6ff04dca365d437"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f23b704bea34701da9938654dd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_deaf61da2a9bfe0cc7fd3e1397"`);
    await queryRunner.query(`DROP TABLE "project_status_notification"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b9dda79f47cc16dd6f95685a11"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_10d5e3b7c4f3412bf6ba82f1fb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_206a2108332afbff74c914a07e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1011dc0123d14c06a9bddcdc2e"`);
    await queryRunner.query(`DROP TABLE "project_status_transition"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_14fa612dd1f3ac554faa62f7ff"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d04beec26b2444d9cde212811c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2676ffafe4d84043a69b290cfe"`);
    await queryRunner.query(`DROP TABLE "project_agency_response"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_01f0894feba7f37f8185731d9f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b30c21a3bb1cadbf654d2e860a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f759d96ffccada1ec97f9db817"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f3032f4f9c067dd90d51806594"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7b2b0eec46d15f7972b8adba09"`);
    await queryRunner.query(`DROP TABLE "project_status_history"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a8615c36638af5cbe405f58fca"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_db82efd607917822803ea51c31"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bd0411b25b82012ecee5bc250e"`);
    await queryRunner.query(`DROP TABLE "project_property"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c32ecc1c2fd813140954bdfcc0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cc8f6da014c702e1205ff5e7fc"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8a9eaf80d836df0b31de6a02eb"`);
    await queryRunner.query(`DROP TABLE "project_report"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_214853469dd5c1b77e0ab3b0b7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2236bb453b025c144a12dd42e2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_afbac675a610832f932c2df659"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dc099fee4ada0ae3dc7fda3774"`);
    await queryRunner.query(`DROP TABLE "report_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_16ea8abe722621a10ac15db084"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f480fcefbb14d128759fec0651"`);
    await queryRunner.query(`DROP TABLE "project_number"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_590ffa664889a289918f618e0a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_26e9b340be9a220d82ac75aba8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e4854a8bb51b552c0374014a15"`);
    await queryRunner.query(`DROP TABLE "project_note"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_02f45f04c7279bb629c1c7eb57"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_18f77928db510eb6963cb69976"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_137c389c35d117bd3b57bb3758"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_87fc04dbccafd0b564a2b214fa"`);
    await queryRunner.query(`DROP TABLE "parcel_fiscal"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_774b5c510271eee240e596d980"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7c24503d777690b738ce323bce"`);
    await queryRunner.query(`DROP TABLE "parcel_building"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f9c9b5645952970fe04184d7f3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_37cd8e04f7b073c98d969df0dc"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ff2eb544d938698a090740bf4f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1afa8aa2564a147b63a239ba7b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_24abde90040d45d682843e5c6f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8c7de899d6823ce867d84e9a5a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8d0744d5e33373639336bb921d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a287500cc1c1e800e47308bfbb"`);
    await queryRunner.query(`DROP TABLE "parcel"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d201b60436282e54dc2f4a5900"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_359a7aedcd7b3d97fda4bfbc83"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1f4fd4ee805c533caaf891556c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_705c9558182adb03383285e867"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b1a1fb67dbbe84787e9836745d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_68870a847392c566965ee40b00"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ada44a71f0c630ba3a6360dfd7"`);
    await queryRunner.query(`DROP TABLE "notification_queue"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3393387f688ba9899d39f93f5f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6b2b9d8f3db40276ccf3751645"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1dd63279a1fc0216a61f2d4cc5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c0604eb0c437f557e473e80f83"`);
    await queryRunner.query(`DROP TABLE "notification_template"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_62bf88fe0fbad2490568a3464e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_92ae926b277011146b34e7c63d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8d8b0999e9c0eca839ebc9f044"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8e5ce48d7c645fe89c026dc183"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c8a2d7000e930610fcff4518b5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7687de6e695cb7f4bd9c2c9f75"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_36d8a4897455038c86fe864b56"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_af9dfc9e21f85cf3d6e7b3f364"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_eebf4f4b257d3c54b29cc8612a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_92edd522e47ae4b0c32fd5ec79"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0bf9c3491d0f50a52d4874a5b4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8e81515c1554b7fe9540a80e9d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d2429392781e2bbd3e707d5cbb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_826e688fee211771c9b0f5e3a2"`);
    await queryRunner.query(`DROP TABLE "project_risk"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_485d32d02c154922086bf9f604"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_55ff7ee85ea69072a47da1d158"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d81d7fa7dd028492b040b99f8a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6a3f38c658f937940d6e744e2b"`);
    await queryRunner.query(`DROP TABLE "tier_level"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_68176849c7a540b890086c2482"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1ee68d46c647bbd30af0655406"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fdbbf5ddd085c931b2b9a597c8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7cbf3bb5d2b807ac35197acc7e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_120d2981d695242d3126b2ecf3"`);
    await queryRunner.query(`DROP TABLE "workflow"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_88b12d599bddadf5cf7ed7ca6c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d42b1950f600f2ba10a1073c37"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5ece525a0b4612005a76d0110e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dfa98ba50e790bc7b17248fa20"`);
    await queryRunner.query(`DROP TABLE "project_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fab667986554eb11aac2b87caa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1c1a58bed256b7b2a5f15509a3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e4449ca75afd996e3044832bb0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_caf56f353cb0d8ae6bd750a0c4"`);
    await queryRunner.query(`DROP TABLE "building_fiscal"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fe77a224958124b56f0258febb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_98a4cb83be360a5a1a284d58e4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_448cedce8da97154c0238de097"`);
    await queryRunner.query(`DROP TABLE "fiscal_key"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9c6b73e6e1191c475083a1d5fd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6da6cc15cd660f17f8d5f4b872"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_56aeba3df852659e336883e93d"`);
    await queryRunner.query(`DROP TABLE "building_evaluation"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bc8c2c506f8cc061b0e3380eb1"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_839b7cb82690afe5a15c035b08"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f96c0877bd6385eac3ba1f2c78"`);
    await queryRunner.query(`DROP TABLE "evaluation_key"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0dc5a69385e011b026cf9349a2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a5b3ee7013349be96c40cb9cfd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8ae155b8e2213e901180f54ba4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b3f209b9a4ee05a9eb9ec58fe5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6774c5af0daf3a6f910a4aa042"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e1c368b69fe6d55fb899d4b09f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_660f6a82c58715ccb3e939bec9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6bec46322ae9b4fdc1712ab65e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ecbf2cc6d83ab02e2495f354f7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1db6127f236406fbd224404a56"`);
    await queryRunner.query(`DROP TABLE "building"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d1d9ae93b704c63e33ed6ebbfc"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cd7711c358add04632676cd4cf"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6d34de8157955f540f198dbc61"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_719b4bbf3b93a649f5ef90d968"`);
    await queryRunner.query(`DROP TABLE "property_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fe1614080ee22db893bdfbdeba"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1a24aef900f50e1c3abfe53164"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_806993c03d99558f423ec01bbb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0995f092c645d5412712204fa0"`);
    await queryRunner.query(`DROP TABLE "property_classification"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a3c788ce5a2d7ee0708b63755c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_af5f23834c3bd813da5cd195da"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_09ecbd0495a18dd9c5648e6ede"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a5b6c7d4abbf4a76127c1b3494"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_68d342e36be4fc4f78d1d943c1"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8d89023b6b9a759bee9ba30d08"`);
    await queryRunner.query(`DROP TABLE "administrative_area"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b54101e216cdd5a65212744139"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9d396303fe83e044d69531b128"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ff339e05eab922546e009f6cc7"`);
    await queryRunner.query(`DROP TABLE "province"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_388afb0f03dd0bc943949c24e8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ed5100402d64f5a45c30e724fe"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d8f11c563f58d60c57c96b7b83"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_336d5c7c816dc621dbc820cc2a"`);
    await queryRunner.query(`DROP TABLE "regional_district"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ae7808ddc529eb5f08dac71874"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8d85670f0a3bb38094f1db9023"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_088d32f15fd51a4eee07cdde28"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a6adc6a5b01c4024621c52b1a2"`);
    await queryRunner.query(`DROP TABLE "building_predominate_use"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d4305f752c6248063c083a27f4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4068747f6c9171d4106950eed9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c40ce91f4fff8b30bc116e66d5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_09f8f34216ccfffd99add29359"`);
    await queryRunner.query(`DROP TABLE "building_occupant_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7eb84eaff27e41814425e258bf"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1fe605fd95d54c7a3d8fb8ea63"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6744ccd2014fd4e75709410415"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3bf46797647574d5aeb8122a5a"`);
    await queryRunner.query(`DROP TABLE "building_construction_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_25dccf2207a003f5ecce8a33c7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_352664edaa51c51a3f62d1cd8a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0f567e907073e1bf5af072410c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c3e2e1bb170870974db5ce848f"`);
    await queryRunner.query(`DROP TABLE "access_request"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c01351e0689032ad8995861393"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b7eee57d84fb7ed872e660197f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b000857089edf6cae23b9bc9b8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cdcb63fdec2cdf48ea4589557d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_061257d343976f0dd80167c79e"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_882f8f0de8c784abe421f17cd4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_65aaedd70b9d60594dddcc36b2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0a24ac662369d88db55649f3e5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_051c6dcae604d9286f20cc2d76"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5e16d9d279223ff5fe988f6a3b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_89544ece79ad52653c8fce606b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4087b9d814a4a90af734b6dd3a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_57fd74ea1b8a1b0d85e1c7ad20"`);
    await queryRunner.query(`DROP TABLE "agency"`);
  }
}
