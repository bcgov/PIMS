import './Instructions.scss';

import React from 'react';
import { Accordion } from 'react-bootstrap';

const mandatoryHeaders =
  'PID,Type (Land or Building),Classification,Name,Ministry,Location (City),Latitude,Longitude'.split(
    ',',
  );

const optionalHeaders =
  'Status,Description,Agency (subagency for Ministry),Address,Postal,Assessed Land Value,Land Assessment Year,Netbook Value,Assessed Building Value,Building Assessment Year,Land Area,Legal Description,Construction Type,Predominate Use,Tenancy,Rentable Area,Building Floor Count,Local ID'.split(
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
      <li>Drag and drop a file or select the file upload area to choose a file.</li>
      <li>
        Select the <b>Start Upload</b> button.
      </li>
      <li>Stay on the results page until the upload is complete.</li>
      <li>
        (Optional) Select <b>Download Results</b> to receive a CSV file with each PID and its
        success status.
      </li>
    </ol>

    {/* REQUIREMENTS */}
    <h4>Requirements</h4>
    <ul>
      <li>
        File must be <b>.csv</b> format.
      </li>
      <li>
        CSV file should contain the following headers: Required Headers cannot have blank values.
        <Accordion flush id="required-headers">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Required Headers</Accordion.Header>
            <Accordion.Body>
              <ul>
                {mandatoryHeaders.map((header) => (
                  <li key={header}>{header}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        Optional Headers may have blank values.
        <Accordion flush id="optional-headers">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Optional Headers</Accordion.Header>
            <Accordion.Body>
              <ul>
                {optionalHeaders.map((header) => (
                  <li key={header}>{header}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </li>
      <li>
        Either the <b>parcelId</b> or the <b>pid</b> field can be null, but not both.
      </li>
    </ul>

    {/* CAVEATS */}
    <h4>Caveats</h4>
    <ul>
      <li>A critical failure in the API will fail the entire payload of up to 100 properties.</li>
      <li>
        Progress for buildings is not tracked accurately if multiple buildings with the same PID are
        uploaded. If one is successful, they all are.
      </li>
      <li>
        Names of cities in the Location field must match what is already in the database. Otherwise,
        the property will be rejected.
      </li>
    </ul>
  </div>
);
