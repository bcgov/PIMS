import './UploadProperties.scss';

import { AxiosError } from 'axios';
import { Button } from 'components/common/form/Button';
import { useApi } from 'hooks/useApi';
import React, { useState } from 'react';
import { Accordion, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { csvFileToPropertyModel, IPropertyModel } from 'utils/csvToPropertyModel';

import { FileInput } from './FileInput';

enum UploadPhase {
  FILE_SELECT,
  DATA_UPLOAD,
}

export interface IProgressState {
  message: string;
  totalRecords: number;
  successes: number;
  failures: number;
}

interface IImportedPropertyResponse {
  responseCode: number;
  acceptedProperties: IPropertyModel[];
  rejectedProperties: IPropertyModel[];
}

interface IFeedObject {
  pid: string;
  success: boolean;
}

export const UploadProperties: React.FC = () => {
  const [file, setFile] = useState<File>();
  const [phase, setPhase] = useState<UploadPhase>(UploadPhase.FILE_SELECT);
  const [progress, setProgress] = useState<IProgressState>({
    message: 'Converting CSV file.',
    successes: 0,
    failures: 0,
    totalRecords: 100,
  });
  const [feed, setFeed] = useState<IFeedObject[]>([]);
  const api = useApi();

  const handleFileChange = (e: any) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    // If the file is defined
    if (file) {
      // Proceed to second phase
      setPhase(UploadPhase.DATA_UPLOAD);
      // Convert CSV data into JS objects
      const convertedCsvData: IPropertyModel[] = await csvFileToPropertyModel(file);
      setProgress((prevProgress) => {
        return {
          ...prevProgress,
          totalRecords: convertedCsvData.length,
        };
      });
      const resultsFeed = document.getElementById('results-feed');
      // Split array into chunks and send to endpoint (API restriction)
      const chunkSize = 100;
      for (let i = 0; i < convertedCsvData.length; i += chunkSize) {
        const currentChunk = convertedCsvData.slice(i, i + chunkSize);
        try {
          // Send to API
          const response: IImportedPropertyResponse = await api.importProperties(currentChunk);
          console.log(response);
          // Update progress state
          setProgress((prevProgress) => {
            const updatedSuccesses = prevProgress.successes + response.acceptedProperties.length;
            const updatedFailures = prevProgress.failures + response.rejectedProperties.length;
            return {
              ...prevProgress,
              message: `Uploading Properties: ${updatedFailures + updatedSuccesses} of ${
                prevProgress.totalRecords
              }`,
              successes: updatedSuccesses,
              failures: updatedFailures,
            };
          });
          // Update Feed
          const newFeedItems: IFeedObject[] = [];
          response.acceptedProperties.forEach((property) =>
            newFeedItems.push({ pid: property.pid, success: true }),
          );
          response.rejectedProperties.forEach((property) =>
            newFeedItems.push({ pid: property.pid, success: false }),
          );
          setFeed((prevFeed) => [...prevFeed, ...newFeedItems]);
          if (resultsFeed) {
            resultsFeed.scrollTop = resultsFeed.scrollHeight + 100;
          }
        } catch (e: unknown) {
          console.error(
            'Following properties caused a critical error:',
            (e as AxiosError).response?.data,
          );
        }
      }
      setProgress((prevProgress) => {
        return {
          ...prevProgress,
          message: 'Upload Complete',
        };
      });
      console.log(progress);
      // Add final report here
      if (resultsFeed) {
        resultsFeed.scrollTop = resultsFeed.scrollHeight + 100;
      }
    }
  };

  const headers =
    'parcelId,pid,pin,status,fiscalYear,agency,agencyCode,subAgency,propertyType,localId,name,description,classification,civicAddress,city,postal,latitude,longitude,landArea,landLegalDescription,buildingFloorCount,buildingConstructionType,buildingPredominateUse,buildingTenancy,buildingRentableArea,assessed,netBook'.split(
      ',',
    );

  return (
    <div className="csv-upload-page">
      <Container>
        <Row>
          <Col id="instructions" xs={4}>
            <h2>Upload Instructions</h2>
            {/* STEPS */}
            <h4>Upload Steps</h4>
            <ol>
              <li>Drag and drop a file or select the file upload area to select a file.</li>
              <li>
                Select the <b>Start Upload</b> button.
              </li>
              <li>Stay on the results page until the upload is complete.</li>
              <li>
                Select <b>Download Results</b> to receive a CSV file with PID and their success
                status.
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
          </Col>
          <Col>
            {phase === UploadPhase.DATA_UPLOAD ? (
              <div id="progress-area">
                <h4>Do not leave the page or close the window until the upload is complete.</h4>
                <p id="progress-message">{progress.message}</p>
                <ProgressBar>
                  <ProgressBar
                    animated={progress.failures + progress.successes !== progress.totalRecords}
                    variant="success"
                    now={progress.successes}
                    key={1}
                    max={progress.totalRecords}
                    min={0}
                  />
                  <ProgressBar
                    animated={progress.failures + progress.successes !== progress.totalRecords}
                    variant="danger"
                    now={progress.failures}
                    max={progress.totalRecords}
                    key={2}
                    min={0}
                  />
                </ProgressBar>
                <div id="results-feed">
                  {feed.map((item) =>
                    item.success ? (
                      <div
                        key={item.pid}
                        className="feed-item feed-success"
                      >{`PID ${item.pid} uploaded successfully.`}</div>
                    ) : (
                      <div
                        key={item.pid}
                        className="feed-item feed-failure"
                      >{`PID ${item.pid} failed to upload.`}</div>
                    ),
                  )}
                  {progress.failures + progress.successes === progress.totalRecords ? (
                    <div id="final-feed-report">
                      <p>Upload completed. {progress.totalRecords} properties uploaded.</p>
                      <p>Successes: {progress.successes}</p>
                      <p>Failures: {progress.failures}</p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <>
                <FileInput file={file} onChange={handleFileChange} />
                {file ? (
                  <Button
                    id="upload-button"
                    onClick={() => {
                      onUpload();
                    }}
                  >
                    Start Upload
                  </Button>
                ) : (
                  <></>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
