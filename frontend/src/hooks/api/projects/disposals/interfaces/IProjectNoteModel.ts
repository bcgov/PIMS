import { IBaseModel } from 'hooks/api/interfaces';

export interface IProjectNoteModel extends IBaseModel {
  id: number;
  projectId: number;
  noteType: number;
  note: string;
}
