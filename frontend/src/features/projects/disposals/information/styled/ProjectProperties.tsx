import { Col } from 'components/flex';
import styled from 'styled-components';

export const ProjectProperties = styled(Col)`
  .table .thead .th {
    cursor: default;
  }

  .tbody {
    max-height: 20em;
    overflow-y: scroll;

    .td {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .remove:hover {
        cursor: pointer;
        color: ${(props) => props.theme.css?.dangerColor};
      }
    }

    .clickable {
      color: ${(props) => props.theme.css?.activeColor};
      text-decoration: underline;
    }
  }
`;
