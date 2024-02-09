import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class FullMigration1707268607199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFilePath = path.resolve(__dirname, 'Seeds');

    const Users = SqlReader.readSqlFile(path.join(sqlFilePath, 'Users_202401241615.sql'));
    await queryRunner.query(Users.toString());

    const Agencies = SqlReader.readSqlFile(path.join(sqlFilePath, 'Agencies_202401251646.sql'));
    await queryRunner.query(Agencies.toString());

    const Provinces = SqlReader.readSqlFile(path.join(sqlFilePath, 'Provinces_202401241102.sql'));
    await queryRunner.query(Provinces.toString());

    const BuildingOccupantTypes = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingOccupantTypes_202401301141.sql'),
    );
    await queryRunner.query(BuildingOccupantTypes.toString());

    const BuildingPredominateUses = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingPredominateUses_202401301156.sql'),
    );
    await queryRunner.query(BuildingPredominateUses.toString());

    const NotificationTemplates = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'NotificationTemplates_202401301346.sql'),
    );
    await queryRunner.query(NotificationTemplates.toString());

    const ProjectRisks = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectRisks_202401301443.sql'),
    );
    await queryRunner.query(ProjectRisks.toString());

    const ProjectStatus = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatus_202401301456.sql'),
    );
    await queryRunner.query(ProjectStatus.toString());

    const TierLevels = SqlReader.readSqlFile(path.join(sqlFilePath, 'TierLevels_202402011455.sql'));
    await queryRunner.query(TierLevels.toString());

    const Workflows = SqlReader.readSqlFile(path.join(sqlFilePath, 'Workflows_202401311420.sql'));
    await queryRunner.query(Workflows.toString());

    const WorkflowProjectStatus = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'WorkflowProjectStatus_202401311454.sql'),
    );
    await queryRunner.query(WorkflowProjectStatus.toString());

    const PropertyClassifications = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'PropertyClassifications_202402010859.sql'),
    );
    await queryRunner.query(PropertyClassifications.toString());

    const PropertyTypes = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'PropertyTypes_202402011400.sql'),
    );
    await queryRunner.query(PropertyTypes.toString());

    const BuildingConstructionTypes = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingConstructionTypes_202401251351.sql'),
    );
    await queryRunner.query(BuildingConstructionTypes.toString());

    const Tasks = SqlReader.readSqlFile(path.join(sqlFilePath, 'Tasks_202402011411.sql'));
    await queryRunner.query(Tasks.toString());

    const ProjectStatusNotifications = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatusNotifications_202401301558.sql'),
    );
    await queryRunner.query(ProjectStatusNotifications.toString());

    const ProjectStatusTransitions = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatusTransitions_202401311020.sql'),
    );
    await queryRunner.query(ProjectStatusTransitions.toString());

    const Roles = SqlReader.readSqlFile(path.join(sqlFilePath, 'Roles.sql'));
    await queryRunner.query(Roles.toString());

    const ReportTypes = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ReportTypes_2024020081047.sql'),
    );
    await queryRunner.query(ReportTypes.toString());

    const RegionalDistricts = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'RegionalDistricts_20240208.sql'),
    );
    await queryRunner.query(RegionalDistricts.toString());
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE project_status_transition cascade');
    await queryRunner.query('TRUNCATE TABLE project_status_notification cascade');
    await queryRunner.query('TRUNCATE TABLE workflow_project_status cascade');
    await queryRunner.query('TRUNCATE TABLE notification_template cascade');
    await queryRunner.query('TRUNCATE TABLE fiscal_key cascade');
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
