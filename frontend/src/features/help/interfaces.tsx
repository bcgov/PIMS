/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
import { ReactNode } from 'react';

export enum HelpPageKeys {
  LANDING_PAGE = '/mapview',
  INVENTORY_PAGE = '/properties/list',
  PROPERTY_DETAIL_PAGE = 'sidebar=true',
  CREATE_PROJECT = '/dispose/projects',
  ASSESS_PROJECT = '/projects/assess',
}

export interface IHelpPage {
  name: string;
  topics: Map<Topics, ReactNode>;
}

export interface IHelpForm {
  user: string;
  email: string;
  page: string;
}

export enum Topics {
  LANDING_MAP = 'Map',
  LANDING_FILTER = 'Filter',
  LANDING_NAVIGATION = 'Navigation',
  INVENTORY_LIST = 'List',
  INVENTORY_FILTER = 'Filter',
  INVENTORY_NAVIGATION = 'Navigation',
  DETAIL_VIEW = 'View',
  DETAIL_NAVIGATION = 'Navigation',
  CREATE_PROJECT_NAVIGATION = 'Navigation',
  CREATE_PROJECT_STEPS = 'Steps',
  ASSESS_PROJECT = 'Assess',
  TUTORIALS = 'Tutorials',
}
