import * as React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { getTopics } from '../constants/HelpText';
import './HelpBox.scss';
import { IHelpPage, Topics } from '../interfaces';

interface IHelpBoxProps {
  /** The current help page that is being displayed */
  helpPage: IHelpPage | undefined;
  /** The active topic that is being displayed on this help page, only one topic is displayed at a time. */
  activeTopic: Topics;
  /** Set the active topic */
  setActiveTopic: Function;
}

const Box = styled.div`
  display: flex;
  align-items: start;
`;

const TopicButton = styled(Button)`
  max-height: 40px;
  background-color: white;
`;

const TopicSelector = styled(ButtonGroup)``;

/**
 * Display a list of topics, as well as the content component corresponding to the active topic.
 */
const HelpBox: React.FunctionComponent<IHelpBoxProps> = ({
  helpPage,
  activeTopic,
  setActiveTopic,
}) => {
  return (
    <Box className="help-box">
      <TopicSelector vertical className="col-md-4">
        {getTopics(helpPage).map((topic, index) => (
          <TopicButton
            key={`topics-${topic}-${index}`}
            onClick={() => setActiveTopic(topic)}
            active={topic === activeTopic}
            bsPrefix="link"
          >
            {topic}
          </TopicButton>
        ))}
      </TopicSelector>
      <span className="col-md-8">{helpPage?.topics.get(activeTopic)}</span>
    </Box>
  );
};

export default HelpBox;
