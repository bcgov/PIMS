import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { TimestampType } from '../Entities/TimestampType';
import { ProjectStatus } from '../Entities/ProjectStatus';
import { NoteType } from '../Entities/NoteType';
import { MonetaryType } from '../Entities/MonetaryType';
import { Task } from '../Entities/Task';
import { User } from '../Entities/User';

export class MoveMetadataToTables1717629146741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const systemUser = await queryRunner.manager.findOne(User, { where: { Username: 'system' } });
    const systemId = systemUser.Id;
    const result = await queryRunner.manager.save(ProjectStatus, {
      Id: 44, //For some reason there is no sequence on project_status
      Name: 'Close Out',
      Code: 'CLS-OUT',
      Description: 'Status related to filling out the close out form.',
      IsMilestone: true,
      IsTerminal: false,
      Route: '/place/holder',
      CreatedById: systemId,
    });
    await queryRunner.manager.insert(TimestampType, [
      { Name: 'AdjustedOn', IsOptional: true, StatusId: result.Id, CreatedById: systemId }, //ProjectCloseOut
      { Name: 'ApprovedForSplOn', IsOptional: true, StatusId: 21, CreatedById: systemId }, //ProjectSPLApproval, ProjectERPComplete
      {
        Name: 'ClearanceNotificationSentOn',
        IsOptional: true,
        StatusId: 14,
        CreatedById: systemId,
      }, //ProjectERPComplete
      { Name: 'DisposedOn', IsOptional: true, StatusId: 32, CreatedById: systemId }, //ProjectERPDisposed, ProjectCloseOut
      { Name: 'ExemptionApprovedOn', IsOptional: true, StatusId: 15, CreatedById: systemId }, //ProjectERPExemption
      { Name: 'FinalFormSignedOn', IsOptional: true, StatusId: result.Id, CreatedById: systemId }, //ProjectCloseOut
      { Name: 'InterestedReceivedOn', IsOptional: true, StatusId: 14, CreatedById: systemId }, //ProjectERPComplete
      { Name: 'OfferAcceptedOn', IsOptional: true, StatusId: 32, CreatedById: systemId }, //ProjectERPDisposed, ProjectNotSPL, ProjectSPLContractInPlace
      { Name: 'RemovalFromSplApprovedOn', IsOptional: true, StatusId: 21, CreatedById: systemId }, //ProjectSPLApproval
      { Name: 'RemovalFromSplRequestOn', IsOptional: true, StatusId: 21, CreatedById: systemId }, //ProjectSPLApproval
      { Name: 'RequestForSplReceivedOn', IsOptional: true, StatusId: 14, CreatedById: systemId }, //ProjectERPComplete, ProjectSPLApproval
      { Name: 'TransferredWithinGreOn', IsOptional: true, StatusId: 20, CreatedById: systemId }, //ProjectERPComplete, ProjectNotSPL
    ]);

    await queryRunner.manager.insert(NoteType, [
      { Name: 'FinalFormSignedBy', IsOptional: true, StatusId: result.Id, CreatedById: systemId },
      { Name: 'PlannedFutureUse', IsOptional: true, StatusId: result.Id, CreatedById: systemId },
      {
        Name: 'PreliminaryFormSignedBy',
        IsOptional: true,
        StatusId: result.Id,
        CreatedById: systemId,
      },
      { Name: 'Purchaser', IsOptional: true, StatusId: result.Id, CreatedById: systemId }, //ProjectCloseOut, ProjectERPDisposed, ProjectNotSPL, ProjectSPLContractInPlace
      { Name: 'Realtor', IsOptional: true, StatusId: result.Id, CreatedById: systemId },
      { Name: 'RealtorRate', IsOptional: true, StatusId: result.Id, CreatedById: systemId }, //Note: This looks like it may be a percentage value, so does this make sense? Only one instance of it being filled in my database.
    ]);

    await queryRunner.manager.insert(MonetaryType, [
      { Name: 'GainBeforeSPL', IsOptional: true, StatusId: result.Id, CreatedById: systemId },
      { Name: 'InterestComponent', IsOptional: true, StatusId: result.Id, CreatedById: systemId },
      { Name: 'NetProceeds', IsOptional: true, StatusId: result.Id, CreatedById: systemId },
      {
        Name: 'OCGFinancialStatement',
        IsOptional: true,
        StatusId: result.Id,
        CreatedById: systemId,
      },
      { Name: 'OfferAmount', IsOptional: true, StatusId: result.Id, CreatedById: systemId }, //ProjectERPDisposed, ProjectNotSPL, ProjectSPLContractInPlace
      { Name: 'ProgramCost', IsOptional: true, StatusId: result.Id, CreatedById: systemId }, //ProjectSummary, ProjectPropertyInformation, ProjectCloseOut
      { Name: 'RealtorCommision', IsOptional: true, StatusId: result.Id, CreatedById: systemId },
      { Name: 'SalesCost', IsOptional: true, StatusId: result.Id, CreatedById: systemId }, //ProjectSummary, ProjectPropertyInformation, ProjectCloseOut
    ]);
    await queryRunner.query(`SELECT setval('task_id_seq', (SELECT MAX(id) FROM task), true) `);
    await queryRunner.manager.insert(Task, [
      { Name: 'Exemption requested', IsOptional: true, StatusId: 4, CreatedById: systemId }, //Seems to be associated with approving the project, so probably place in the Add form in new design?
      {
        Name: 'Prior year adjustment',
        IsOptional: true,
        StatusId: result.Id,
        CreatedById: systemId,
      },
    ]);

    await queryRunner.manager.update(
      NoteType,
      {
        Name: In([
          'Adjustment',
          'SplCost',
          'SplGain',
          'SalesHistory',
          'CloseOut',
          'Comments',
          'Remediation',
        ]),
      },

      { StatusId: result.Id },
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(TimestampType, {
      Name: In([
        'AdjustedOn',
        'ApprovedForSplOn',
        'ClearanceNotificationSentOn',
        'DisposedOn',
        'ExemptionApprovedOn',
        'FinalFormSignedOn',
        'InterestedReceivedOn',
        'OfferAcceptedOn',
        'RemovalFromSplApprovedOn',
        'RemovalFromSplRequestOn',
        'RequestForSplReceivedOn',
        'TransferredWithinGreOn',
      ]),
    });

    await queryRunner.manager.update(
      NoteType,
      {
        Name: In([
          'Adjustment',
          'SplCost',
          'SplGain',
          'SalesHistory',
          'CloseOut',
          'Comments',
          'Remediation',
        ]),
      },
      { StatusId: 21 },
    );

    await queryRunner.manager.delete(NoteType, {
      Name: In([
        'FinalFormSignedBy',
        'PlannedFutureUse',
        'PreliminaryFormSignedBy',
        'Purchaser',
        'Realtor',
        'RealtorRate',
      ]),
    });

    await queryRunner.manager.delete(MonetaryType, {
      Name: In([
        'GainBeforeSPL',
        'InterestComponent',
        'NetProceeds',
        'OCGFinancialStatement',
        'OfferAmount',
        'ProgramCost',
        'RealtorCommision',
        'SalesCost',
      ]),
    });

    await queryRunner.manager.delete(Task, {
      Name: In(['Exemption requested', 'Prior year adjustment']),
    });

    await queryRunner.manager.delete(ProjectStatus, { Name: 'Close Out' });
  }
}
