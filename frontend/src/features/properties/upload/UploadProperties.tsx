import './UploadProperties.scss';

import { AxiosError } from 'axios';
import { Button } from 'components/common/form/Button';
import { useApi } from 'hooks/useApi';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { csvFileToPropertyModel, IPropertyModel } from 'utils/csvToPropertyModel';

import { FileInput } from './FileInput';
import { Instructions } from './Instructions';
import { UploadProgress } from './UploadProgress';

enum UploadPhase {
  FILE_SELECT,
  DATA_UPLOAD,
}

export interface IProgressState {
  message: string;
  totalRecords: number;
  successes: number;
  failures: number;
  complete: boolean;
}

interface IImportedPropertyResponse {
  responseCode: number;
  acceptedProperties: IPropertyModel[];
  rejectedProperties: IPropertyModel[];
}

export interface IFeedObject {
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
    complete: false,
  });
  const [feed, setFeed] = useState<IFeedObject[]>([]);
  const api = useApi();

  const handleFileChange = (e: any) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    const files: File[] = Array.from(e.dataTransfer.files);
    if (files[0]) setFile(files[0]);
  };

  const resultsFeed = document.getElementById('results-feed');
  useEffect(() => {
    if (resultsFeed) {
      resultsFeed.scrollTo({
        top: resultsFeed.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [feed]);

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
          const response: IImportedPropertyResponse = await api.importProperties(currentChunk);
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
    }
  };

  return (
    <div className="csv-upload-page">
      <Container>
        <Row>
          <Col xs={4}>
            <Instructions />
          </Col>
          <Col>
            {phase === UploadPhase.DATA_UPLOAD ? (
              <UploadProgress {...{ feed, progress }} />
            ) : (
              <>
                <FileInput file={file} onChange={handleFileChange} onDrop={handleFileDrop} />
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
