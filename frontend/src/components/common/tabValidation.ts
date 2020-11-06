export interface ValidationGroup {
  schema: any;
  tab: string;
  statusCode: string;
}

/** return tab error classname if tab is in error */
export const isTabInError = (errors: any, tabName: string) => {
  return (errors.tabs as string[])?.includes(tabName) ? 'tabError' : '';
};
