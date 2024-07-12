import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { ProjectStatus } from '../Entities/ProjectStatus';
import { Task } from '../Entities/Task';
import { User } from '../Entities/User';
import { NoteType } from '../Entities/NoteType';
import { ProjectTask } from '../Entities/ProjectTask';
import { ProjectNote } from '../Entities/ProjectNote';
const disableBatch = [
  'Select Properties',
  'Update Information',
  'Approval',
  'Review',
  'Draft',
  'In ERP',
  'Contract in Place - Unconditional',
  'Document Review',
  'Appraisal Review',
  'First Nation Consultation',
  'Exemption Review',
];

const moveToApprovedForErp = [
  'Documents received and review completed',
  'Preparation and due diligence',
  'Consultation underway',
  'Consultation complete',
];
const moveToApprovedForErpCont = ['Appraisal ordered', 'Appraisal received'];
const tasksToDuplicate = [
  'Documents received and review completed',
  'Appraisal ordered',
  'Appraisal received',
  'Preparation and due diligence',
  'Consultation underway',
  'Consultation complete',
];
const moveToApprovedForExemption = [
  'Notification to confirm exemption request sent to agency ADM',
  'Confirmation has been received from agency ADM',
];
export class DisableAndConsolidateStatuses1720731741735 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const systemUser = await queryRunner.manager.findOneOrFail(User, {
      where: { Username: 'system' },
    });

    await queryRunner.manager.update(
      ProjectStatus,
      { Name: In(disableBatch) },
      { IsDisabled: true },
    );

    await queryRunner.manager.update(
      ProjectStatus,
      { Name: 'Contract in Place - Conditional' },
      {
        Name: 'Contract in Place',
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: In(moveToApprovedForErp) },
      {
        StatusId: 14, //Approved for ERP
      },
    );
    await queryRunner.manager.update(
      Task,
      { Name: In(moveToApprovedForErpCont), StatusId: 11 },
      {
        StatusId: 14, //Approved for ERP
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: 'Appraisal ordered', StatusId: 14 },
      {
        SortOrder: 4,
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: 'Appraisal received', StatusId: 14 },
      {
        SortOrder: 5,
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: 'Notification to confirm exemption request sent to agency ADM' },
      {
        SortOrder: 6,
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: 'Confirmation has been received from agency ADM' },
      {
        SortOrder: 7,
      },
    );

    await queryRunner.manager.update(NoteType, { Name: 'Appraisal' }, { StatusId: 14 });

    await queryRunner.query( //Making an Approved for Exemption version for each of these fields.
      `INSERT INTO task (name, sort_order, is_disabled, description, is_optional, status_id, created_by_id) 
      SELECT name, sort_order, is_disabled, description, is_optional, 15, $1
      FROM task WHERE name IN (${tasksToDuplicate.map((_, id) => `$${id + 2}`)}) AND status_id = 14`,
      [systemUser.Id, ...tasksToDuplicate],
    );
    //This is cloning existing project entries filed under the original version of these fields.
    //We do one join to get the set of the original versions, then we do an additional self join which
    //maps us from the task_id's under status_id 14 (for ERP) to the equivalent task_id under status_id 15 (for Exemption)
    //We then select only the relevant fields to use as the values list in a bulk insertion operation.
    await queryRunner.query(
      `INSERT INTO project_task (project_id, task_id, is_completed, completed_on, created_by_id)
        SELECT
            project_id,
            t_destination.id AS task_id,
            is_completed,
            completed_on,
            $1
        FROM
            project_task pt
        JOIN task t_origin ON
            pt.task_id = t_origin.id
            AND t_origin.name IN (${tasksToDuplicate.map((_, id) => `$${id + 2}`)})
            AND t_origin.status_id = 14
        JOIN task t_destination 
            ON t_origin.name = t_destination.name 
            AND t_destination.status_id = 15`,
      [systemUser.Id, ...tasksToDuplicate],
    );

    await queryRunner.query(
      `INSERT INTO note_type (name, sort_order, is_disabled, description, is_optional, status_id, created_by_id) 
                SELECT name, sort_order, is_disabled, description, is_optional, 15, $1
                FROM note_type WHERE name = $2 AND status_id = 14`,
      [systemUser.Id, 'Appraisal'],
    );

    await queryRunner.query(
      `INSERT INTO project_note (project_id, note_type_id, note, created_by_id)
        SELECT
            project_id,
            t_destination.id AS note_type_id,
            note,
            $1
        FROM
            project_note pt
        JOIN note_type t_origin ON
            pt.note_type_id = t_origin.id
            AND t_origin.name = $2
            AND t_origin.status_id = 14
        JOIN note_type t_destination 
            ON t_origin.name = t_destination.name 
            AND t_destination.status_id = 15`,
      [systemUser.Id, 'Appraisal'],
    );

    await queryRunner.manager.update(
      Task,
      { Name: In(moveToApprovedForExemption) },
      { StatusId: 15 }, //Approved for Exemption
    );

    await queryRunner.manager.insert(Task, {
      Name: 'Contract is conditional',
      IsOptional: false,
      CreatedById: systemUser.Id,
      CreatedOn: new Date(),
      StatusId: 42, //Should be Contract in Place
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.update(
      ProjectStatus,
      { Name: In(disableBatch) },
      { IsDisabled: false },
    );

    await queryRunner.manager.update(
      ProjectStatus,
      { Name: 'Contract in Place' },
      {
        Name: 'Contract in Place - Conditional',
      },
    );

    const deletingTaskIds = (
      await queryRunner.manager.find(Task, {
        where: { Name: In(tasksToDuplicate), StatusId: 15 },
      })
    ).map((a) => a.Id);
    const deletingNoteId = (
      await queryRunner.manager.findOne(NoteType, {
        where: { Name: 'Appraisal', StatusId: 15 },
      })
    ).Id;
    await queryRunner.manager.delete(ProjectTask, { TaskId: In(deletingTaskIds) });
    await queryRunner.manager.delete(ProjectNote, { NoteTypeId: deletingNoteId });

    await queryRunner.manager.delete(Task, { Id: In(deletingTaskIds) });
    await queryRunner.manager.delete(NoteType, { Id: deletingNoteId });

    await queryRunner.manager.update(
      Task,
      { Name: 'Appraisal ordered', StatusId: 14 },
      {
        SortOrder: 1,
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: 'Appraisal received', StatusId: 14 },
      {
        SortOrder: 2,
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: 'Notification to confirm exemption request sent to agency ADM' },
      {
        SortOrder: 1,
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: 'Confirmation has been received from agency ADM' },
      {
        SortOrder: 2,
      },
    );

    await queryRunner.manager.update(
      Task,
      { Name: 'Documents received and review completed' },
      { StatusId: 10 },
    ); //Back to Document Review

    await queryRunner.manager.update(
      Task,
      { Name: In(moveToApprovedForErpCont), StatusId: 14 },
      { StatusId: 11 },
    ); //Back to Appraisal Review

    await queryRunner.manager.update(
      NoteType,

      { Name: 'Appraisal' },
      { StatusId: 11 }, // Back to Appraisal review
    );

    await queryRunner.manager.update(
      Task,
      {
        Name: In([
          'Preparation and due diligence',
          'Consultation underway',
          'Consultation complete',
        ]),
      },
      { StatusId: 12 },
    ); //Back to First Nations Consultation

    await queryRunner.manager.update(
      Task,
      {
        Name: In([
          'Notification to confirm exemption request sent to agency ADM',
          'Confirmation has been received from agency ADM',
        ]),
      },
      { StatusId: 13 }, //Back to Exemption Review
    );

    await queryRunner.manager.delete(Task, {
      Name: 'Contract is conditional',
    });
  }
}
