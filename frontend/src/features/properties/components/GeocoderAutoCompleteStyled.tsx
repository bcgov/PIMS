import styled from 'styled-components';

export const GeocoderAutoCompleteStyled = styled.div`
  .form.Control {
    width: 100%;
    height: 100%;
    border: none;
    font-size: 16px;
    box-sizing: border-box;
    flex: 1 1;
    min-width: 0;
    margin-bottom: 0;
  }

  .suggestionList {
    background-color: white;
    border-style: solid;
    border-color: lightslategray;
    border-width: thin;
    font-size: 14px;
    text-align: left;
    max-height: 600px;
    margin: 0;
    padding: 0;
    position: absolute;
    z-index: 999;
    top: 40px;
    left: -50px;
  }

  option {
    padding: 10px 5px;
    word-wrap: break-word;
    width: 400px;
    overflow: hidden;
    cursor: pointer;
    color: #494949;

    &:hover {
      background-color: #007bff;
      color: #fff;
    }
  }
`;
