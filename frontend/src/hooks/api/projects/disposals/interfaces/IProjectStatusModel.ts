import { IBaseLookupModel } from 'hooks/api/interfaces';

import { IProjectTaskModel } from '.';

export interface IProjectStatusModel extends IBaseLookupModel<number> {
  route?: string;
  isTerminal: boolean;
  tasks: IProjectTaskModel[];
}
