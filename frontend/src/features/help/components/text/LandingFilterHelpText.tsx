import * as React from 'react';

/**
 * Help Text for the Landing Page Filter topic.
 */
const LandingFilterHelpText = () => {
  return (
    <p>
      Help Desk The filter provides a way to search for properties with the specified properties.
      The filter is cumilative ("AND"), which means each value will refine the results.
      <br />
      <strong>Address:</strong> The address contains the value.
      <br />
      <strong>Location:</strong> The administrative area (city, municipality, district, etc.)
      containing the value.
      <br />
      <strong>PID/PIN:</strong> The property has the specified PID or PIN.
      <br />
      <strong>SPP No.:</strong> The project containing the value.
      <br />
      <strong>Agency:</strong> The property belongs to the specified agency.
      <br />
      <strong>Classification:</strong> The property has the specified classification.
      <br />
      <strong>Min Lot Size:</strong> The property is greater than or equal to the value.
      <br />
      <strong>Max Lot Size:</strong> The property is less than or equal to the value.
      <br />
      <strong>Enhanced Referral Process:</strong> The property is in the ERP.
      <br />
      <strong>Surplus Properties List:</strong> The property is on the SPL.
      <br />
    </p>
  );
};

export default LandingFilterHelpText;
