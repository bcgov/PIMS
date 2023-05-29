import { Col } from 'components/flex';
import styled from 'styled-components';

export const ActiveStatus = styled(Col)`
  background-color: ${(props) => props.theme.css?.completedColor};
  color: ${(props) => props.theme.css?.primaryTextColor};
  border-radius: 0.5em;
  padding: 0.5em;
  height: 100%;

  & > span {
    display: inline;
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
  }
`;
