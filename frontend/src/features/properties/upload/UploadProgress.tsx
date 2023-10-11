import './UploadProgress.scss';

import { Button } from 'components/common/form/Button';
import React, { useEffect } from 'react';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';

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
}

/**
 * @description Shows the ongoing progress for the property upload
 * @param {IUploadProgressProps} props Properties passed to this component
 * @returns {React.FC} A React component
 */
export const UploadProgress = (props: IUploadProgressProps) => {
  const { feed, progress, phase } = props;
  // Creates an imaginary link and clicks it to download a file
  const onDownloadResults = () => {
    const csvFile = dataToCsvFile(feed);
    const link = document.createElement('a');
    link.setAttribute('id', 'download-link');
    link.setAttribute('href', csvFile);
    link.setAttribute('download', 'upload_results.csv');
    link.click();
  };

  // Used to scroll nicely down the upload feed area
  const resultsFeed = document.getElementById('results-feed');
  useEffect(() => {
    if (resultsFeed) {
      resultsFeed.scrollTo({
        top: resultsFeed.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [feed]);

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
        {feed.map((item, index) =>
          item.success ? (
            <div
              key={`${item.pid}:${index}`}
              className="feed-item feed-success"
            >{`PID ${item.pid} uploaded successfully.`}</div>
          ) : (
            <div
              key={`${item.pid}:${index}`}
              className="feed-item feed-failure"
            >{`PID ${item.pid} failed to upload.`}</div>
          ),
        )}
        {phase === UploadPhase.DONE ? (
          <Container id="final-feed-report">
            <Row>
              <Col sm={6}>
                <p>Upload completed. {progress.totalRecords} properties uploaded.</p>
                <p>Successes: {progress.successes}</p>
                <p>Failures: {progress.failures}</p>
              </Col>
              <Col sm={6}>
                <Button id="download-results-button" onClick={onDownloadResults}>
                  Download Results
                </Button>
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
