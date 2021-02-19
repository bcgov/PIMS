import Claims from 'constants/claims';
import { Workflows } from 'constants/workflows';
import { fetchProject, IProject } from 'features/projects/common';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
 */
export const ProjectNumberLink: React.FC<IProjectNumberLinkProps> = ({
  projectNumber,
  agencyId,
  setPrivateProject,
  privateProject,
}) => {
  const dispatch = useDispatch();
  const keycloak = useKeycloakWrapper();
  /** Stores the various states of the project route (summary page, project status route) */
  const [projectRoute, setProjectRoute] = useState<string>('');
  /** State used to determine whether further project info has been fetcehd already */
  const [loaded, setLoaded] = useState<boolean>(false);

  /** This function determines whether to display the project number as a link or just text */
  const displayProjectNumber = () => {
    if (privateProject) {
      return (
        <>
          {projectNumber}
          <br />
        </>
      );
    } else {
      return (
        <>
          <Link to={`${projectRoute}?projectNumber=${projectNumber}`}>{projectNumber}</Link>
          <br />
        </>
      );
    }
  };

  useEffect(() => {
    if (!loaded) {
      if (keycloak.hasAgency(+agencyId)) {
        (dispatch(fetchProject(projectNumber)) as any).then((project: IProject) => {
          if (
            keycloak.hasClaim(Claims.ADMIN_PROJECTS) ||
            (keycloak.hasAgency(project.agencyId) &&
              project.workflowCode === Workflows.SUBMIT_DISPOSAL)
          ) {
            setProjectRoute(project?.status?.route!);
          } else if (
            project.workflowCode !== Workflows.SUBMIT_DISPOSAL &&
            keycloak.hasAgency(project.agencyId)
          ) {
            setProjectRoute('/projects/summary');
          }
        });
      } else {
        setPrivateProject(true);
      }
      setLoaded(true);
    }
  }, [dispatch, projectNumber, privateProject, setPrivateProject, agencyId, keycloak, loaded]);

  return displayProjectNumber();
};
