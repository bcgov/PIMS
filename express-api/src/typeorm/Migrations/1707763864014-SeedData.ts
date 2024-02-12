import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class SeedData1707763864014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFilePath = path.resolve(__dirname, 'Seeds');

    const Users = SqlReader.readSqlFile(path.join(sqlFilePath, 'Users.sql'));
    await queryRunner.query(Users.toString());

    const Agencies = SqlReader.readSqlFile(path.join(sqlFilePath, 'Agencies.sql'));
    await queryRunner.query(Agencies.toString());

    const Provinces = SqlReader.readSqlFile(path.join(sqlFilePath, 'Provinces.sql'));
    await queryRunner.query(Provinces.toString());

    const BuildingOccupantTypes = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingOccupantTypes.sql'),
    );
    await queryRunner.query(BuildingOccupantTypes.toString());

    const BuildingPredominateUses = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingPredominateUses.sql'),
    );
    await queryRunner.query(BuildingPredominateUses.toString());

    const NotificationTemplates = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'NotificationTemplates.sql'),
    );
    await queryRunner.query(NotificationTemplates.toString());

    const ProjectRisks = SqlReader.readSqlFile(path.join(sqlFilePath, 'ProjectRisks.sql'));
    await queryRunner.query(ProjectRisks.toString());

    const ProjectStatus = SqlReader.readSqlFile(path.join(sqlFilePath, 'ProjectStatus.sql'));
    await queryRunner.query(ProjectStatus.toString());

    const TierLevels = SqlReader.readSqlFile(path.join(sqlFilePath, 'TierLevels.sql'));
    await queryRunner.query(TierLevels.toString());

    const Workflows = SqlReader.readSqlFile(path.join(sqlFilePath, 'Workflows.sql'));
    await queryRunner.query(Workflows.toString());

    const WorkflowProjectStatus = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'WorkflowProjectStatus.sql'),
    );
    await queryRunner.query(WorkflowProjectStatus.toString());

    const PropertyClassifications = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'PropertyClassifications.sql'),
    );
    await queryRunner.query(PropertyClassifications.toString());

    const PropertyTypes = SqlReader.readSqlFile(path.join(sqlFilePath, 'PropertyTypes.sql'));
    await queryRunner.query(PropertyTypes.toString());

    const BuildingConstructionTypes = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingConstructionTypes.sql'),
    );
    await queryRunner.query(BuildingConstructionTypes.toString());

    const Tasks = SqlReader.readSqlFile(path.join(sqlFilePath, 'Tasks.sql'));
    await queryRunner.query(Tasks.toString());

    const ProjectStatusNotifications = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatusNotifications.sql'),
    );
    await queryRunner.query(ProjectStatusNotifications.toString());

    const ProjectStatusTransitions = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatusTransitions.sql'),
    );
    await queryRunner.query(ProjectStatusTransitions.toString());

    const Roles = SqlReader.readSqlFile(path.join(sqlFilePath, 'Roles.sql'));
    await queryRunner.query(Roles.toString());

    const ReportTypes = SqlReader.readSqlFile(path.join(sqlFilePath, 'ReportTypes.sql'));
    await queryRunner.query(ReportTypes.toString());

    const RegionalDistricts = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'RegionalDistricts.sql'),
    );
    await queryRunner.query(RegionalDistricts.toString());

    const AdministrativeAreas = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'AdministrativeAreas.sql'),
    );
    await queryRunner.query(AdministrativeAreas.toString());

    const FiscalKeys = SqlReader.readSqlFile(path.join(sqlFilePath, 'FiscalKeys.sql'));
    await queryRunner.query(FiscalKeys.toString());

    const EvaluationKeys = SqlReader.readSqlFile(path.join(sqlFilePath, 'EvaluationKeys.sql'));
    await queryRunner.query(EvaluationKeys.toString());

    const ProjectTypes = SqlReader.readSqlFile(path.join(sqlFilePath, 'ProjectTypes.sql'));
    await queryRunner.query(ProjectTypes.toString());
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE project_type cascade');
    await queryRunner.query('TRUNCATE TABLE evaluation_key cascade');
    await queryRunner.query('TRUNCATE TABLE fiscal_key cascade');
    await queryRunner.query('TRUNCATE TABLE administrative_area cascade');
    await queryRunner.query('TRUNCATE TABLE report_types cascade');
    await queryRunner.query('TRUNCATE TABLE project_status_transition cascade');
    await queryRunner.query('TRUNCATE TABLE project_status_notification cascade');
    await queryRunner.query('TRUNCATE TABLE workflow_project_status cascade');
    await queryRunner.query('TRUNCATE TABLE notification_template cascade');
    await queryRunner.query('TRUNCATE TABLE building_construction_type cascade');
    await queryRunner.query('TRUNCATE TABLE building_occupant_type cascade');
    await queryRunner.query('TRUNCATE TABLE building_predominate_use cascade');
    await queryRunner.query('TRUNCATE TABLE property_classification cascade');
    await queryRunner.query('TRUNCATE TABLE property_type cascade');
    await queryRunner.query('TRUNCATE TABLE tier_level cascade');
    await queryRunner.query('TRUNCATE TABLE agency cascade');
    await queryRunner.query('TRUNCATE TABLE role cascade');
    await queryRunner.query('TRUNCATE TABLE province cascade');
    await queryRunner.query('TRUNCATE TABLE project_risk cascade');
    await queryRunner.query('TRUNCATE TABLE workflow cascade');
    await queryRunner.query('TRUNCATE TABLE project_status cascade');
    await queryRunner.query('TRUNCATE TABLE task cascade');
    await queryRunner.query('TRUNCATE TABLE regional_district cascade');
    await queryRunner.query('TRUNCATE TABLE "user" cascade'); // Seems to only work with quotes.
  }
}
