import * as React from 'react';
import { Row } from 'react-bootstrap';

/**
 * Subform that allows the user to either find or enter the associated parcel when they are the owner.
 */
const LeasedLandOwned: React.FunctionComponent = () => {
  return (
    <>
      <h6>Owned Land</h6>

      <Row>
        <p>
          To identify the land this building sits on, enter the parcel's pid or higlight the parcel
          on the map.
        </p>
      </Row>
    </>
  );
};

export default LeasedLandOwned;
