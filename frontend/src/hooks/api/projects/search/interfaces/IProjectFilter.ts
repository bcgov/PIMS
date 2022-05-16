import { IPageFilter } from 'hooks/api/interfaces';

export interface IProjectFilter extends IPageFilter {
  projectNumber?: string;
  name?: string;
  statusId?: number[];
  tierLevelId?: number;
  fiscalYear?: number;
  createdByMe?: boolean;
  sPLWorkflow?: boolean;
  active?: boolean;
  agencies?: number[];
  workflows?: string[];
  reportId?: number;
}
