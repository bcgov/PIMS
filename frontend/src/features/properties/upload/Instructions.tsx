import './Instructions.scss';

import React from 'react';
import { Accordion } from 'react-bootstrap';

const headers =
  'parcelId,pid,pin,status,fiscalYear,agency,agencyCode,subAgency,propertyType,localId,name,description,classification,civicAddress,city,postal,latitude,longitude,landArea,landLegalDescription,buildingFloorCount,buildingConstructionType,buildingPredominateUse,buildingTenancy,buildingRentableArea,assessed,netBook'.split(
    ',',
  );

/**
 * @description A set of instructions for the CSV upload page
 * @returns {React.FC} A div with a list of instructions.
 */
export const Instructions = () => (
  <div id="instructions">
    <h2>Upload Instructions</h2>
    {/* STEPS */}
    <h4>Steps</h4>
    <ol>
      <li>Drag and drop a file or select the file upload area to select a file.</li>
      <li>
        Select the <b>Start Upload</b> button.
      </li>
      <li>Stay on the results page until the upload is complete.</li>
      <li>
        Select <b>Download Results</b> to receive a CSV file with PID and their success status.
      </li>
    </ol>
    {/* REQUIREMENTS */}
    <h4>Requirements</h4>
    <ul>
      <li>
        File must be <b>.csv</b> format.
      </li>
      <li>
        CSV file should contain the following headers, although some fields can be null:
        <Accordion flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Required Headers</Accordion.Header>
            <Accordion.Body>
              <ul>
                {headers.map((header) => (
                  <li key={header}>{header}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </li>
    </ul>
  </div>
);
