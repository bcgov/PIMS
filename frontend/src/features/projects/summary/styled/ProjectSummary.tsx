import { Col } from 'components/flex';
import styled from 'styled-components';

export const ProjectSummary = styled(Col)`
  .form-group {
    margin: 0;

    & > label {
      margin-right: 1em;
      font-size: 0.9em;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.css?.filterBackgroundColor};
    border-radius: 0.25em;
  }

  .right {
    & > span {
      text-align: right;
    }
  }

  .section {
    border: solid 1px ${(props) => props.theme.css?.formBorderColor};
    background-color: ${(props) => props.theme.css?.formBackground};
    border-radius: 0.5em;
    padding: 0.5em;
  }

  .note {
    & > label {
      margin: 0;
    }
  }
`;
