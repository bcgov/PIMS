import { ILTSAOrderModel } from 'actions/parcelsActions';
import { Charges } from 'components/ltsa/Charges';
import { OwnershipDetails } from 'components/ltsa/OwnershipInformation';
import { TitleDetails } from 'components/ltsa/TitleDetails';
import { getIn, useFormikContext } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

interface ITitleOwnershipProps {
  withNameSpace: Function;
}

export const TitleOwnership: React.FC<any> = (props: ITitleOwnershipProps) => {
  const { withNameSpace } = props;
  const formikProps = useFormikContext();
  const [ltsa, setLTSA] = useState<ILTSAOrderModel | undefined>(undefined);

  useEffect(() => {
    getLTSAInfo();
  }, [formikProps]);

  const getLTSAInfo = useCallback(async () => {
    const ltsaInfo: ILTSAOrderModel | undefined = await getIn(
      formikProps.values,
      withNameSpace('ltsa'),
    );
    if (ltsaInfo) {
      setLTSA(ltsaInfo);
    }
  }, [formikProps]);

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
