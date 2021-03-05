import { ReactNode } from 'react';
import LandingMapHelpText from '../components/text/LandingMapHelpText';
import LandingNavigationHelpText from '../components/text/LandingNavigationHelpText';
import React from 'react';
import LandingFilterHelpText from '../components/text/LandingFilterHelpText';
import QuestionForm from '../forms/QuestionForm';
import BugForm from '../forms/BugForm';
import FeatureRequestForm from '../forms/FeatureRequestForm';
import { Topics, HelpPageKeys, IHelpPage } from '../interfaces';
import InventoryFilterHelpText from '../components/text/InventoryFilterHelpText';
import InventoryListHelpText from '../components/text/InventoryListHelpText';
import InventoryNavigationHelpText from '../components/text/InventoryNavigationHelpText';
import DetailNavigationHelpText from '../components/text/DetailNavigationHelpText';
import DetailViewHelpText from '../components/text/DetailViewHelpText';
import { CreateDisposalNavigationHelpText } from '../components/text/CreateDisposalNavigationHelpText';
import { DisposalStepsHelpText } from '../components/text/DisposalStepsHelpText';
import { AssessDisposalProjectText } from '../components/text/AssesDisposalProjectText';

/**
 * a map between a topic name and the component to display when the corresponding topic name is active. This map only includes topics for the landing page.
 */
export const landingPageTopics = new Map<Topics, ReactNode>([
  [Topics.LANDING_MAP, <LandingMapHelpText />],
  [Topics.LANDING_FILTER, <LandingFilterHelpText />],
  [Topics.LANDING_NAVIGATION, <LandingNavigationHelpText />],
]);

/**
 * a map between a topic name and the component to display when the corresponding topic name is active. This map only includes topics for the inventory page.
 */
export const inventoryPageTopics = new Map<Topics, ReactNode>([
  [Topics.INVENTORY_LIST, <InventoryListHelpText />],
  [Topics.INVENTORY_FILTER, <InventoryFilterHelpText />],
  [Topics.INVENTORY_NAVIGATION, <InventoryNavigationHelpText />],
]);

/**
 * a map between a topic name and the component to display when the corresponding topic name is active. This map only includes topics for the property detail page.
 */
export const propertyDetailPageTopics = new Map<Topics, ReactNode>([
  [Topics.DETAIL_VIEW, <DetailViewHelpText />],
  [Topics.DETAIL_NAVIGATION, <DetailNavigationHelpText />],
]);

/**
 * a map between a topic name and the component to display when the corresponding topic name is active. This map only includes topics for the creation of disposal projects.
 */
export const createProjectPageTopics = new Map<Topics, ReactNode>([
  [Topics.CREATE_PROJECT_NAVIGATION, <CreateDisposalNavigationHelpText />],
  [Topics.CREATE_PROJECT_STEPS, <DisposalStepsHelpText />],
]);

export const assessProjectPageTopics = new Map<Topics, ReactNode>([
  [Topics.ASSESS_PROJECT, <AssessDisposalProjectText />],
]);

/**
 * A map of help pages. The key is the base route path of the component. The value is the help page name, and help topics to display at the corresponding path.
 * Note that currently the base path provided in the key will match all child pages. so for example, /mapview and /mapview/56 will both match the Property Detail page.
 */
export const helpPages = new Map<HelpPageKeys, IHelpPage>([
  [HelpPageKeys.LANDING_PAGE, { name: 'Landing Page', topics: landingPageTopics }],
  [HelpPageKeys.INVENTORY_PAGE, { name: 'Inventory Page', topics: inventoryPageTopics }],
  [
    HelpPageKeys.PROPERTY_DETAIL_PAGE,
    { name: 'Property Detail View Page', topics: propertyDetailPageTopics },
  ],
  [
    HelpPageKeys.CREATE_PROJECT,
    { name: 'Create Disposal Project', topics: createProjectPageTopics },
  ],
  [HelpPageKeys.ASSESS_PROJECT, { name: 'Assess Project', topics: assessProjectPageTopics }],
]);

export const PropertyDetailViewHelpPage: IHelpPage = {
  name: 'Property Detail View Page',
  topics: propertyDetailPageTopics,
};

/**
 * All of the supported ticket types, these are displayed as radio buttons on the help modal.
 * All ticket types should be mapped to a form in the helpTickets object below.
 */
export enum TicketTypes {
  QUESTION = 'Question',
  BUG = 'Bug',
  FEATURE_REQUEST = 'Feature Request',
}

/**
 * A map between a ticket type and a corresponding form to display when that ticket is active.
 */
export const helpTickets = new Map<string, (props: any) => ReactNode>([
  [TicketTypes.QUESTION, props => <QuestionForm {...props} />],
  [TicketTypes.BUG, props => <BugForm {...props} />],
  [TicketTypes.FEATURE_REQUEST, props => <FeatureRequestForm {...props} />],
]);

/**
 * Return a list of topics for the current page being displayed (ie. the landing page)
 * @param currentPage the current page being displayed in the app
 */
export const getTopics = (currentPage: IHelpPage | undefined) => {
  return currentPage?.topics?.keys() === undefined ? [] : Array.from(currentPage.topics.keys());
};

/**
 * This is the email that all support tickets should be directed to when using the issue reporting system.
 */
export const pimsSupportEmail = 'rpdimithelp@gov.bc.ca';
