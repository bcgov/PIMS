import { UUID } from 'crypto';
import { IBaseEntity } from '@/controllers/common/IBaseEntity';

export interface IAdministrativeArea extends IBaseEntity {
  id?: UUID;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  abbreviation: string;
  boundaryType: string;
  regionalDistrict: string;
}
