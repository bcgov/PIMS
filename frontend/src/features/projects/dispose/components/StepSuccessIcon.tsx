import * as React from 'react';
import styled from 'styled-components';
import { FaRegCheckCircle } from 'react-icons/fa';

interface IStepSuccessIconProps {
  /** label displayed before the icon */
  preIconLabel: string;
  /** label displayed after the icon */
  postIconLabel: string;
}

const ColoredWrapper = styled.div`
  color: #2e8540;
  text-align: center;
  margin-bottom: 1rem;
`;

const SpacedHeader = styled.h5`
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-family: 'BCSans', Fallback, sans-serif;
`;

/**
 * Common component used to display a large success icon with text before and after.
 */
const StepSuccessIcon: React.FunctionComponent<IStepSuccessIconProps> = ({
  preIconLabel,
  postIconLabel,
}: IStepSuccessIconProps) => {
  return (
    <ColoredWrapper>
      <SpacedHeader>{preIconLabel}</SpacedHeader>
      <FaRegCheckCircle size={64} />
      <SpacedHeader>{postIconLabel}</SpacedHeader>
    </ColoredWrapper>
  );
};

export default StepSuccessIcon;
