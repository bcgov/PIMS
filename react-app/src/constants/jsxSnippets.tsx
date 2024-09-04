import { LookupContext } from '@/contexts/lookupContext';
import React, { useContext } from 'react';

const backupEmail = 'RealPropertyDivision.Disposals@gov.bc.ca';

export const accessPendingBlurb = () => {
  const lookup = useContext(LookupContext);
  return (
    <>
      We have received your request. We will notify you via email when your request has been
      reviewed. If you haven&apos;t heard from us within five business days, please feel free to
      reach out to us at{' '}
      <a href={`mailto: ${lookup.data?.Config?.contactEmail ?? backupEmail}`}>
        {lookup.data?.Config?.contactEmail ?? backupEmail}
      </a>
      .
    </>
  );
};

export const accountInactiveBlurb = () => {
  const lookup = useContext(LookupContext);

  return (
    <>
      This account is currently inactive and cannot access PIMS. If you believe this is an error or
      require the account to be reactivated, please feel free to reach out to us at{' '}
      <a href={`mailto: ${lookup.data?.Config?.contactEmail ?? backupEmail}`}>
        {lookup.data?.Config?.contactEmail ?? backupEmail}
      </a>
      .
    </>
  );
};

export const signupTermsAndConditionsClaim = (
  <>
    By signing up, you confirm that you have read the{' '}
    <a
      href="https://www2.gov.bc.ca/gov/content/home/disclaimer"
      target="_blank"
      rel="noopener noreferrer"
    >
      Disclaimer
    </a>{' '}
    and{' '}
    <a
      href="https://www2.gov.bc.ca/gov/content/home/privacy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Privacy Policy
    </a>
    .
  </>
);

export const awaitingRoleBlurb = () => {
  const lookup = useContext(LookupContext);

  return (
    <>
      This account is currently active but has not been assigned a role. If you believe this is an
      error or require assistance, please feel free to reach out to us at{' '}
      <a href={`mailto: ${lookup.data?.Config?.contactEmail ?? backupEmail}`}>
        {lookup.data?.Config?.contactEmail ?? backupEmail}
      </a>
      .
    </>
  );
};
