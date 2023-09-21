import './UploadProperties.scss';

import { AxiosError } from 'axios';
import { Button } from 'components/common/form/Button';
import { useApi } from 'hooks/useApi';
import React, { useState } from 'react';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
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
  results: React.FC[];
}

export const UploadProperties: React.FC = () => {
  const [file, setFile] = useState<File>();
  const [phase, setPhase] = useState<UploadPhase>(UploadPhase.FILE_SELECT);
  const [progress, setProgress] = useState<IProgressState>({
    message: 'Converting CSV file.',
    successes: 0,
    failures: 0,
    totalRecords: 100,
    results: [],
  });
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
      // Split array into chunks and send to endpoint (API restriction)
      const chunkSize = 100;
      for (let i = 0; i < convertedCsvData.length; i += chunkSize) {
        const currentChunk = convertedCsvData.slice(i, i + chunkSize);
        try {
          // Send to API
          const response = await api.importProperties(currentChunk);
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
    }
  };

  return (
    <div className="csv-upload-page">
      <Container>
        <Row>
          <Col id="instructions" xs={4}>
            <h2>Upload Instructions</h2>
            <p>Follow these instructions.</p>
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
                <div id="results-feed">{/* {progress.results.map(result => )} */}</div>
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
