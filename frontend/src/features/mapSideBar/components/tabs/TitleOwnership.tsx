import { ILTSAOrderModel } from 'actions/parcelsActions';
import { Charges } from 'components/ltsa/Charges';
import { OwnershipDetails } from 'components/ltsa/OwnershipInformation';
import { TitleDetails } from 'components/ltsa/TitleDetails';
import React from 'react';

interface ITitleOwnershipProps {
  ltsa: ILTSAOrderModel;
}

export const TitleOwnership: React.FC<any> = (props: ITitleOwnershipProps) => {
  const { ltsa } = props;
  return ltsa ? (
    <>
      <p
        style={{
          display: 'flex',
          margin: '1em',
          color: 'GrayText',
          fontSize: '11pt',
        }}
      >
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
    <p
      style={{
        display: 'flex',
        margin: '1em',
        color: 'GrayText',
        fontSize: '11pt',
      }}
    >
      No LTSA information available for this PID.
    </p>
  );
};
