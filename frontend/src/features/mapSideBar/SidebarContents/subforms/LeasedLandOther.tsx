import * as React from 'react';
import { TextArea } from 'components/common/form';

interface ILeasedLandOtherProps {
  nameSpace?: string;
}

/**
 * Subform that allows the user to enter a note defining the land ownership situation for this building.
 * @param {ILeasedLandOtherProps} props
 */
const LeasedLandOther: React.FunctionComponent<ILeasedLandOtherProps> = props => {
  const withNameSpace: Function = (fieldName: string) => {
    const { nameSpace } = props;
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  return (
    <>
      <h5>Other</h5>
      <p>Describe the land ownership situation for this parcel.</p>
      <i>(ie: This land is provided to our agency through a Crown grant)</i>
      <TextArea field={withNameSpace('ownershipNote')}></TextArea>
    </>
  );
};

export default LeasedLandOther;
