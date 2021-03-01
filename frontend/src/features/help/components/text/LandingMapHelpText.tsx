import * as React from 'react';

/**
 * Help Text for the Landing Page Map topic.
 */
const LandingMapHelpText = () => {
  return (
    <p>
      The map provides a way to visually find properties that belong to your agency, or sub-agencies
      and surplus properties held by other agencies that are part of the Enhanced Referral Process
      (ERP) or on the Surplus Properties List (SPL).
      <br /> If there are too many properties grouped together, it will show a cluster on the map.
      Click on the cluster to zoom in. You can filter the results by entering an Agency, Location,
      Address, PID/PIN, or Classification.
      <br /> To search for surplus properties, click the "Surplus Properties" button to open up the
      surplus-specific search panel which will allow you to search by ERP/SPL, Location, SPP number,
      Min-Max lot size, predominant use and net usable area.
    </p>
  );
};

export default LandingMapHelpText;
