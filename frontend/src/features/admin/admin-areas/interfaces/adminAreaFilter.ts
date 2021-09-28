/** interface containing filterable values for administrative areas */
export interface IAdminAreaFilter {
  name?: string;
  id?: number;
  page?: number;
  quantity?: number;
  sort?: string | string[];
}
