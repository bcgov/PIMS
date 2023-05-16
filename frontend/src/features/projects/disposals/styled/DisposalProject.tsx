import styled from 'styled-components';

export const DisposalProject = styled.div`
  .manual {
    width: 10em;

    svg {
      width: 25px;
      height: 25px;
    }
  }

  .project-footer {
    column-gap: 0.5em;
    padding-top: 0.5em;
    justify-content: flex-end;
  }

  .form-section {
    border: solid ${(props) => props.theme.css?.formBorderColor} 1px;
    margin: 0.25em;
    padding: 0.25em;
  }

  .react-datepicker-wrapper {
    display: block;
  }

  .form-group {
    margin-bottom: 0;
  }

  label {
    font-size: 0.8em;
    margin-bottom: 0;
  }

  .invalid-feedback {
    display: inline-block;
  }
`;
