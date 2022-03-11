import { Col } from 'components/flex';
import styled from 'styled-components';

export const ProjectInformation = styled(Col)`
  .project-details {
    div {
      flex: 1 1 0px;
    }
  }

  .project-info {
    & > div {
      & > div {
        div {
          flex: 1 1 0px;
        }
      }
    }
  }
`;
