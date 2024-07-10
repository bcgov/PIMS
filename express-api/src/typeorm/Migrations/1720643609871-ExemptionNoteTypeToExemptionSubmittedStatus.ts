import { MigrationInterface, QueryRunner } from 'typeorm';
import { NoteType } from '../Entities/NoteType';

export class ExemptionNoteTypeToExemptionSubmittedStatus1720643609871
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.update(NoteType, { Name: 'Exemption' }, { StatusId: 8 }); //Move to Submitted Exemption status
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.update(NoteType, { Name: 'Exemption' }, { StatusId: 15 }); //Move back to Approved for Exemption status
  }
}
