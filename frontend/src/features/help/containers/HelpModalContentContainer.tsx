import * as React from 'react';
import { helpPages, TicketTypes, getTopics } from '../constants/HelpText';
import HelpBox from '../components/HelpBox';
import HelpSubmitBox from '../components/HelpSubmitBox';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Topics, IHelpPage } from '../interfaces';
import { useLocation } from 'react-router-dom';

interface IHelpModalContentContainerProps {
  /** Set the content of the parent mailto component based on the ticket form. */
  setMailto: Function;
}

/**
 * Find the first help page to match the start of the help page path. For example both /mapview and /mapview/56 will be matched to the /mapview Parcel Detail Help Page.
 * @param location The current react router location within the application.
 */
const getHelpPageByLocation = (location: any): IHelpPage | undefined => {
  let helpPage: IHelpPage | undefined = undefined;
  helpPages.forEach((page, path) => {
    if (location.pathname.startsWith(path)) {
      helpPage = page;
    }
  });
  return helpPage;
};

/**
 * Provides logic for modal content. User information is provided by keycloak. The current page is determined using the react router location.
 */
const HelpModalContentContainer: React.FunctionComponent<IHelpModalContentContainerProps> = ({
  setMailto,
}) => {
  const [activeTopic, setActiveTopic] = React.useState<Topics | undefined>();
  const [activeTicketType, setActiveTicketType] = React.useState<TicketTypes>(TicketTypes.QUESTION);
  const keycloak = useKeycloakWrapper();
  const location = useLocation();
  const helpPage = getHelpPageByLocation(location);
  const displayName = keycloak.displayName;
  const email = keycloak.email;
  return (
    <>
      <HelpBox
        activeTopic={activeTopic ?? getTopics(helpPage)[0]}
        setActiveTopic={setActiveTopic}
        helpPage={helpPage}
      ></HelpBox>
      <hr></hr>
      <h5>Submit a</h5>
      <HelpSubmitBox
        user={displayName ?? ''}
        email={email ?? ''}
        activeTicketType={activeTicketType}
        setActiveTicketType={setActiveTicketType}
        page={helpPage?.name ?? location.pathname}
        setMailto={setMailto}
      />
    </>
  );
};

export default HelpModalContentContainer;
