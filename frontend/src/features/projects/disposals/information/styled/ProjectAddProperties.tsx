import { Col } from 'components/flex';
import styled from 'styled-components';

export const ProjectAddProperties = styled(Col)`
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

      .add:hover {
        cursor: pointer;
        color: ${(props) => props.theme.css?.activeColor};
      }
    }

    .clickable {
      color: ${(props) => props.theme.css?.activeColor};
      text-decoration: underline;
    }
  }

  ul {
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
    column-gap: 0;
    border: 0;

    li {
      padding: 0;
      margin: 0;
      color: ${(props) => props.theme.css?.textColor};
      background-color: inherit;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
`;
