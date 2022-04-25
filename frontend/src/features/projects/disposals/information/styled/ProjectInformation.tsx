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

    .tierLevelId {
      align-items: flex-start;
      align-content: flex-start;
      div {
        flex: unset;
      }
    }

    .riskId {
      align-items: flex-start;
      align-content: flex-start;
      div {
        flex: unset;
      }
    }

    select[name='tierLevelId'] {
      width: unset;
    }

    select[name='riskId'] {
      width: unset;
    }
  }
`;
