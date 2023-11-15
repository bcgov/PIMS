import './UploadProgress.scss';

import { Button } from 'components/common/form/Button';
import React from 'react';
import { Accordion, Col, Container, ProgressBar, Row } from 'react-bootstrap';

import { dataToCsvFile } from '../../../utils/csvToPropertyModel';
import { IFeedObject, IProgressState, UploadPhase } from './UploadProperties';

/**
 * @interface
 * @description Properties received as props for UploadProgress
 * @param {IProgressState} progress The current progress of the upload
 * @param {IFeedObject[]} feed The list of feed objects to populate user feedback area
 */
interface IUploadProgressProps {
  phase: UploadPhase;
  progress: IProgressState;
  feed: IFeedObject[];
  onRestart?: React.MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<any>;
  onReturn?: React.MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<any>;
}

/**
 * @description Shows the ongoing progress for the property upload
 * @param {IUploadProgressProps} props Properties passed to this component
 * @returns {React.FC} A React component
 */
export const UploadProgress = (props: IUploadProgressProps) => {
  const { feed, progress, phase, onRestart, onReturn } = props;
  // Creates an imaginary link and clicks it to download a file
  const onDownloadResults = () => {
    const csvFile = dataToCsvFile(feed);
    const link = document.createElement('a');
    link.setAttribute('id', 'download-link');
    link.setAttribute('href', csvFile);
    link.setAttribute('download', 'upload_results.csv');
    link.click();
  };

  // Returns true if item was successfully added
  const itemSuccessful = (item: IFeedObject) => item.added === true || item.updated === true;

  // Creates phrase to mention pid (existing or missing)
  const getPidPhrase = (item: IFeedObject) =>
    item.pid && item.pid !== '' ? `PID ${item.pid}` : 'missing PID';

  const getName = (item: IFeedObject) => (item.name && item.name !== '' ? item.name : 'N/A');

  return (
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
        <Accordion flush id="successful-items">
          <Accordion.Item eventKey="0">
            <Accordion.Header>{`Successes: ${progress.successes}`}</Accordion.Header>
            <Accordion.Body className="feed-accordion">
              {feed
                .filter((item) => itemSuccessful(item))
                .map((item, index) => (
                  <div key={`${item.pid}:${index}`} className="feed-item feed-success">
                    <p>
                      {`${item.type === 'Land' ? 'Parcel' : 'Building'} with ${getPidPhrase(
                        item,
                      )} ${item.updated ? 'updated' : 'added'} successfully.`}
                    </p>
                    <p>{`Property Name: ${getName(item)}`}</p>
                  </div>
                ))}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>{`Failures: ${progress.failures}`}</Accordion.Header>
            <Accordion.Body className="feed-accordion">
              {feed
                .filter((item) => !itemSuccessful(item))
                .map((item, index) => (
                  <div key={`${item.pid}:${index}`} className="feed-item feed-failure">
                    <p>{`${item.type === 'Land' ? 'Parcel' : 'Building'} with ${getPidPhrase(
                      item,
                    )} failed to upload.`}</p>
                    <p>{`Property Name: ${getName(item)}`}</p>
                    <p>{`Error: ${item.error && item.error !== '' ? item.error : 'Unknown'}`}</p>
                  </div>
                ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {phase === UploadPhase.DONE ? (
          <Container id="final-feed-report">
            <Row>
              <Col sm={7}>
                <p>Upload completed. {progress.totalRecords} entries processed.</p>
                <p>Successes: {progress.successes}</p>
                <p>Failures: {progress.failures}</p>
              </Col>
              <Col sm={5}>
                <Button
                  id="download-results-button"
                  className="progress-button"
                  onClick={onDownloadResults}
                >
                  Download Results
                </Button>
                {onRestart ? (
                  <Button
                    id="restart-upload-button"
                    className="progress-button"
                    onClick={onRestart}
                  >
                    Restart Upload
                  </Button>
                ) : (
                  <></>
                )}
                {onReturn ? (
                  <Button
                    id="return-to-upload-button"
                    className="progress-button"
                    onClick={onReturn}
                  >
                    Upload New File
                  </Button>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </Container>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
