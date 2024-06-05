export interface CommonFiltering {
  page?: number;
  quantity?: number;
  order?: Record<string, 'ASC' | 'DESC'>;
}
