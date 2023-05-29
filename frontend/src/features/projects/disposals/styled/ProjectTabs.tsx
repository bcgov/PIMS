import styled from 'styled-components';

export const ProjectTabs = styled.div`
  position: relative;

  .loading {
    display: flex;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: ${(props) => props.theme.css?.darkVariantColor};
    opacity: 0.35;
    border-radius: 0.25em;

    & > div {
      margin: auto;
      color: ${(props) => props.theme.css?.accentColor};
    }
  }
`;
