import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class FullMigration1707268607199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFilePath = path.resolve(__dirname, 'Seeds');
    const sqlContent1 = SqlReader.readSqlFile(path.join(sqlFilePath, 'Users_202401241615.sql'));
    await queryRunner.query(sqlContent1.toString());
    const sqlContent2 = SqlReader.readSqlFile(path.join(sqlFilePath, 'Agencies_202401251646.sql'));
    await queryRunner.query(sqlContent2.toString());
    const sqlContent3 = SqlReader.readSqlFile(path.join(sqlFilePath, 'Provinces_202401241102.sql'));
    await queryRunner.query(sqlContent3.toString());
    const sqlContent4 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingOccupantTypes_202401301141.sql'),
    );
    await queryRunner.query(sqlContent4.toString());
    const sqlContent5 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingPredominateUses_202401301156.sql'),
    );
    await queryRunner.query(sqlContent5.toString());
    const sqlContent6 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'NotificationTemplates_202401301346.sql'),
    );
    await queryRunner.query(sqlContent6.toString());
    const sqlContent7 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectRisks_202401301443.sql'),
    );
    await queryRunner.query(sqlContent7.toString());
    const sqlContent8 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatus_202401301456.sql'),
    );
    await queryRunner.query(sqlContent8.toString());
    const sqlContent9 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'TierLevels_202402011455.sql'),
    );
    await queryRunner.query(sqlContent9.toString());
    const sqlContent10 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'Workflows_202401311420.sql'),
    );
    await queryRunner.query(sqlContent10.toString());
    const sqlContent11 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'WorkflowProjectStatus_202401311454.sql'),
    );
    await queryRunner.query(sqlContent11.toString());
    const sqlContent13 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'PropertyClassifications_202402010859.sql'),
    );
    await queryRunner.query(sqlContent13.toString());
    const sqlContent14 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'PropertyTypes_202402011400.sql'),
    );
    await queryRunner.query(sqlContent14.toString());
    const sqlContent15 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'BuildingConstructionTypes_202401251351.sql'),
    );
    await queryRunner.query(sqlContent15.toString());
    const sqlContent16 = SqlReader.readSqlFile(path.join(sqlFilePath, 'Tasks_202402011411.sql'));
    await queryRunner.query(sqlContent16.toString());
    const sqlContent17 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatusNotifications_202401301558.sql'),
    );
    await queryRunner.query(sqlContent17.toString());
    const sqlContent12 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ProjectStatusTransitions_202401311020.sql'),
    );
    await queryRunner.query(sqlContent12.toString());
    // const sqlContent18 = SqlReader.readSqlFile(path.join(sqlFilePath, 'TierLevels_202402011455.sql'));
    // await queryRunner.query(sqlContent18.toString());

    const sqlContent19 = SqlReader.readSqlFile(path.join(sqlFilePath, 'Roles.sql'));
    await queryRunner.query(sqlContent19.toString());

    const sqlContent20 = SqlReader.readSqlFile(
      path.join(sqlFilePath, 'ReportTypes_2024020081047.sql'),
    );
    await queryRunner.query(sqlContent20.toString());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE user');
    await queryRunner.query('TRUNCATE TABLE agency');
    await queryRunner.query('TRUNCATE TABLE province');
    await queryRunner.query('TRUNCATE TABLE fiscal_key');
    await queryRunner.query('TRUNCATE TABLE building_occupant_type');
    await queryRunner.query('TRUNCATE TABLE building_predominate_use');
    await queryRunner.query('TRUNCATE TABLE notification_template');
    await queryRunner.query('TRUNCATE TABLE project_risk');
    await queryRunner.query('TRUNCATE TABLE project_status');
    await queryRunner.query('TRUNCATE TABLE tier_level');
    await queryRunner.query('TRUNCATE TABLE workflow');
    await queryRunner.query('TRUNCATE TABLE workflow_project_status');
    await queryRunner.query('TRUNCATE TABLE property_classification');
    await queryRunner.query('TRUNCATE TABLE property_type');
    await queryRunner.query('TRUNCATE TABLE building_construction_type');
    await queryRunner.query('TRUNCATE TABLE task');
    await queryRunner.query('TRUNCATE TABLE project_status_notification');
    await queryRunner.query('TRUNCATE TABLE project_status_transition');
    await queryRunner.query('TRUNCATE TABLE role');
  }
}
