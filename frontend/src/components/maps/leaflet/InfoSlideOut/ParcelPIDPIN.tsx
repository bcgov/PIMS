import * as React from 'react';
import { IParcel } from 'actions/parcelsActions';
import { OuterRow } from './InfoContent';
import { ThreeColumnItem } from './ThreeColumnItem';
import { pidFormatter } from 'features/properties/components/forms/subforms/PidPinForm';

interface IParcelPIDPIN {
  /** the selected parcel information */
  parcelInfo: IParcel;
}

/**
 * Displays PID/PIN information in property popout for selected parcel
 * @param parcelInfo parcel data
 */
export const ParcelPIDPIN: React.FC<IParcelPIDPIN> = ({ parcelInfo }) => {
  return (
    <OuterRow>
      {parcelInfo?.pid && (
        <ThreeColumnItem leftSideLabel={'PID'} rightSideItem={pidFormatter(parcelInfo?.pid)} />
      )}
      {parcelInfo?.pin && <ThreeColumnItem leftSideLabel={'PIN'} rightSideItem={parcelInfo?.pin} />}
    </OuterRow>
  );
};

export default ParcelPIDPIN;
