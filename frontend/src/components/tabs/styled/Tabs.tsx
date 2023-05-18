import styled from 'styled-components';

export const Tabs = styled.div`
  padding-top: 1em;

  & > ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    margin: 0;
    padding-left: 0.5em;
    padding-right: 0.5em;
    column-gap: 0.5em;
    border-bottom: solid 1px ${(props) => props.theme.css?.primaryColor};

    li {
      background-color: ${(props) => props.theme.css?.primaryLightColor};
      color: ${(props) => props.theme.css?.primaryTextColor};
      padding: 0.5em;
      border-top-left-radius: 0.25em;
      border-top-right-radius: 0.25em;
      text-align: center;
      cursor: pointer;
    }

    li.active {
      background-color: ${(props) => props.theme.css?.secondaryVariantColor};
    }
  }

  .tab-body {
    background: linear-gradient(rgba(240, 240, 240, 0.55), rgba(240, 240, 240, 0.55));
    border-bottom-left-radius: 0.25em;
    border-bottom-right-radius: 0.25em;
    padding: 0.5em;
    box-shadow: 2px 2px ${(props) => props.theme.css?.formBackground};
    border-left: solid 1px ${(props) => props.theme.css?.formBackground};
  }

  hr {
    width: 100%;
    border: solid 1px ${(props) => props.theme.css?.formBackground};
    margin: 0;
    padding: 0;
  }
`;
