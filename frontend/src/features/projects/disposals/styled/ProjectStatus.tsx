import { Row } from 'components/flex';
import styled from 'styled-components';

export const ProjectStatus = styled(Row)`
  button {
    flex-grow: 1;

    &[class~='btn-danger'] {
      max-width: 10em;
    }
  }

  & > div {
    align-items: center;
  }

  .status {
    background-color: ${(props) => props.theme.css?.filterBackgroundColor};
    padding: 0.5em;
    border-radius: 0.5em;

    .btn-secondary {
      background-color: white;
    }

    .btn-secondary:hover {
      background-color: ${(props) => props.theme.css?.dropdownBackgroundColor};
    }
  }

  .workflow {
    background-color: #fff;
    border-radius: 0.25em;
    color: #2e8540;
  }
`;
