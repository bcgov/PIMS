import { Container } from 'react-bootstrap';
import styled from 'styled-components';

export const ProjectLayout = styled(Container)`
  font-family: 'BCSans', Fallback, sans-serif;
  text-align: left;
  margin-bottom: ${(props) => props.theme.css?.footerHeight};
  background-color: ${(props) => props.theme.css?.formBackground};
  padding-left: 10rem;
  padding-right: 10rem;
  color: ${(props) => props.theme.css?.textColor};
  height: ${(props) =>
    `calc(100vh - ${props.theme.css?.headerHeight} - ${props.theme.css?.navbarHeight} - ${props.theme.css?.footerHeight})`};
  max-height: ${(props) =>
    `calc(100vh - ${props.theme.css?.headerHeight} - ${props.theme.css?.navbarHeight} - ${props.theme.css?.footerHeight})`};
  overflow-y: auto;

  h1 {
    color: ${(props) => props.theme.css?.primaryLightColor};
    font-size: 20px;
    font-family: 'BCSans-Bold', Fallback, sans-serif;
  }

  h2 {
    padding: 0 !important;
    font-size: 20px;
    font-family: 'BCSans', Fallback, sans-serif;
    color: ${(props) => props.theme.css?.textColor};
  }

  h3 {
    font-family: 'BCSans-Bold', Fallback, sans-serif;
    color: ${(props) => props.theme.css?.primaryColor};
    font-size: 14px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0;
  }

  & > div:first-child {
    min-width: fit-content;
    > .container-fluid {
      margin: 0.5rem 0;
      padding: 5rem 0 0 0;
    }
    padding: 1rem 1.5rem;
    background-color: white;
    min-height: ${(props) =>
      `calc(100vh - ${props.theme.css?.headerHeight} - ${props.theme.css?.navbarHeight} - ${props.theme.css?.footerHeight})`};
  }
`;
