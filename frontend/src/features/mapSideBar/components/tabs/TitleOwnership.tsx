import { ILTSAOrderModel } from 'actions/parcelsActions';
import { Charges } from 'components/ltsa/Charges';
import { OwnershipDetails } from 'components/ltsa/OwnershipInformation';
import { TitleDetails } from 'components/ltsa/TitleDetails';
import React from 'react';

interface ITitleOwnershipProps {
  ltsa: ILTSAOrderModel;
  pid?: string;
}

/**
 * @description For parcel items, shows info from LTSA
 * @param {ITitleOwnershipProps} props
 * @returns React component.
 */
export const TitleOwnership: React.FC<any> = (props: ITitleOwnershipProps) => {
  const { ltsa, pid } = props;

  // Needed a way to check if the current LTSA info stored matches PID of parcel requested.
  // There is a brief period when selecting a new parcel before the LTSA response is received where
  // the old LTSA info is still populated. This is the workaround.
  const finishedLoading = () => {
    if (pid && ltsa) {
      return (
        ltsa.order.orderedProduct.fieldedData.descriptionsOfLand[0].parcelIdentifier.replace(
          /-/g,
          '',
        ) === pid
      );
    }
    return !!ltsa; // Confirmation that LTSA is defined.
  };

  const noInfoParagraphStyle = {
    display: 'flex',
    margin: '1em',
    color: 'GrayText',
    fontSize: '11pt',
  };

  return finishedLoading() ? (
    <>
      <p style={noInfoParagraphStyle}>
        This information was retrieved from the Land Title & Service Authority (LTSA).
      </p>
      {/* TITLE */}
      <TitleDetails {...{ ltsa }} />

      {/* OWNERSHIP INFO */}
      <OwnershipDetails {...{ ltsa }} />

      {/* CHARGES INFO */}
      <Charges {...{ ltsa }} />
    </>
  ) : (
    <p style={noInfoParagraphStyle}>
      No LTSA information available for this PID or information still loading.
    </p>
  );
};
