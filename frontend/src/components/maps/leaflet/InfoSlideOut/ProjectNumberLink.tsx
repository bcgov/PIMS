import Claims from 'constants/claims';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface IProjectNumberLinkProps {
  /** The project number to analyze */
  projectNumber: string;
  /** The agency ID of the property being viewed */
  agencyId: number | '';
  /** To determine whether the project is private to the user or not */
  setPrivateProject: Function;
  /** The result of setPrivateProject used in both the parent and child component */
  privateProject: boolean;
  /** whether or not to add breakline underneath each project number (used for formatting in slideout) */
  breakLine?: boolean;
}

/**
 * This component is used to display project numbers and appropriate links if the user has permission.
 * A user who belongs to the same agency and a project that has not been submitted will grant user access to a link that goes directly to the status.
 * An admin will have access to a link that goes directly to the status.
 * If a user belongs to the agency but the project has been submitted it will redirect you to the summary page.
 * If a user is outside the agency they will not contain a link.
 * @param {string} projectNumber The project number to analyze
 * @param {number} agencyId The agency ID of the property being viewed
 * @param {Function} setPrivateProject Will set the parent state to determine whether the project can be viewed by user
 * @param {boolean} privateProject The resulting boolean of setPrivateProject that is used in the logic in determining whether the number will be a link
 * @param {boolean} breakLine Optional, whether or not to add breakline underneath each project number (used for formatting in slideout)
 */
export const ProjectNumberLink: React.FC<IProjectNumberLinkProps> = ({
  projectNumber,
  agencyId,
  setPrivateProject,
  privateProject,
  breakLine,
}) => {
  const keycloak = useKeycloakWrapper();

  /** This function determines whether to display the project number as a link or just text */
  const displayProjectNumber = () => {
    if (privateProject) {
      return (
        <>
          {projectNumber}
          {breakLine && <br />}
        </>
      );
    } else {
      return (
        <>
          <Link to={`/projects?projectNumber=${projectNumber}`}>{projectNumber}</Link>
          {breakLine && <br />}
        </>
      );
    }
  };

  useEffect(() => {
    /** user does not belong to property agency nor is sres means project detail may not be viewed */
    if (!keycloak.hasAgency(+agencyId) && !keycloak.hasClaim(Claims.ADMIN_PROJECTS)) {
      setPrivateProject(true);
    }
  }, [setPrivateProject, agencyId, keycloak]);

  return displayProjectNumber();
};
