import { NoteTypes } from 'constants/noteTypes';

export interface IProjectNote {
  id?: number;
  noteType: string | NoteTypes;
  note?: string;
  rowVersion?: string;
  projectId?: number;
}
