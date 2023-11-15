import './UploadProperties.scss';

import { AxiosError } from 'axios';
import { Button } from 'components/common/form/Button';
import { useApi } from 'hooks/useApi';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { csvFileToPropertyModel, IPropertyModel } from 'utils/csvToPropertyModel';

import { FileInput } from './FileInput';
import { Instructions } from './Instructions';
import { UploadProgress } from './UploadProgress';

/**
 * @enum
 * @description The possible states of the upload process
 */
export enum UploadPhase {
  FILE_SELECT,
  DATA_UPLOAD,
  DONE,
}

/**
 * @interface
 * @description Defines properties of the progress state
 * @param {string} message      The progress message displayed
 * @param {number} totalRecords The total records parsed from the CSV
 * @param {number} successes    The number of successful uploaded records
 * @param {number} failures     The number of failed records
 */
export interface IProgressState {
  message: string;
  totalRecords: number;
  successes: number;
  failures: number;
}

/**
 * @interface
 * @description Defines the properties of the API response
 * @param {number} responseCode                 HTTP status code
 * @param {IPropertyModel[]} acceptedProperties A list of properties successfully uploaded
 * @param {IPropertyModel[]} rejectedProperties A list of properties that failed to upload

 */
interface IImportedPropertyResponse {
  responseCode: number;
  acceptedProperties: IPropertyModel[];
  rejectedProperties: IPropertyModel[];
}

/**
 * @interface
 * @description Defines the properties of the objects in the feed state
 * @param {string} pid      The PID of that property
 * @param {boolean} success Whether it was successfully uploaded
 */
export interface IFeedObject {
  pid: string;
  type: string;
  name?: string;
  added?: boolean;
  updated?: boolean;
  error?: string;
}

/**
 * @description A page that allows users to upload CSV files to insert properties into the database
 * @returns {React.FC} A React component
 */
export const UploadProperties: React.FC = () => {
  const defaultProgress: IProgressState = {
    message: 'Converting CSV file.',
    successes: 0,
    failures: 0,
    totalRecords: 100,
  };

  const [file, setFile] = useState<File>(); // The file used for the upload
  const [phase, setPhase] = useState<UploadPhase>(UploadPhase.FILE_SELECT); // Controls what the user sees
  // Monitors the progress of the upload calls
  const [progress, setProgress] = useState<IProgressState>(defaultProgress);
  // A list of objects used to populate the upload feed results
  const [feed, setFeed] = useState<IFeedObject[]>([]);
  const api = useApi();

  // When file changes, set the file state
  const handleFileChange = (e: any) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  // When file is dropped on element, update the file state
  const handleFileDrop = (e: any) => {
    e.preventDefault();
    const files: File[] = Array.from(e.dataTransfer.files);
    if (files[0]) setFile(files[0]);
  };

  // Called by other components to reset this page
  const returnToFileUpload = () => {
    setFile(undefined);
    setPhase(UploadPhase.FILE_SELECT);
  };

  // When the Start Upload button is clicked...
  const onUpload = async () => {
    // Set progress to default
    setFeed([]);
    setProgress(defaultProgress);
    setPhase(UploadPhase.DATA_UPLOAD);
    // If the file is defined
    if (file) {
      try {
        // Convert CSV data into JS objects
        const convertedCsvData: IPropertyModel[] = await csvFileToPropertyModel(file);
        // Proceed to second phase
        setPhase(UploadPhase.DATA_UPLOAD);
        setProgress((prevProgress) => {
          return {
            ...prevProgress,
            totalRecords: convertedCsvData.length,
          };
        });
        // Split array into chunks and send to endpoint (API restriction)
        const chunkSize = 50;
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
              newFeedItems.push({
                pid: property.pid,
                name: property.name,
                type: property.propertyType,
                updated: property.updated,
                added: property.added,
                error: '',
              }),
            );
            response.rejectedProperties.forEach((property) =>
              newFeedItems.push({
                pid: property.pid,
                name: property.name,
                type: property.propertyType,
                updated: property.updated,
                added: property.added,
                error: property.error,
              }),
            );
            setFeed((prevFeed) => [...prevFeed, ...newFeedItems]);
          } catch (e: unknown) {
            // Consider all properties in this chunk to have failed.
            setProgress((prevProgress) => {
              const updatedFailures = prevProgress.failures + currentChunk.length;
              return {
                ...prevProgress,
                message: `Uploading Properties: ${updatedFailures + prevProgress.successes} of ${
                  prevProgress.totalRecords
                }`,
                failures: updatedFailures,
              };
            });
            const newFeedItems: IFeedObject[] = [];
            currentChunk.forEach((property) =>
              newFeedItems.push({
                pid: property.pid,
                name: property.name,
                type: property.propertyType,
                updated: false,
                added: false,
                error: (e as AxiosError).message,
              }),
            );
            setFeed((prevFeed) => [...prevFeed, ...newFeedItems]);
            console.error('Following error occurred:', (e as AxiosError).response?.data);
          }
        }
        setProgress((prevProgress) => {
          return {
            ...prevProgress,
            message: 'Upload Complete',
          };
        });
        setPhase(UploadPhase.DONE);
      } catch (e: any) {
        setPhase(UploadPhase.FILE_SELECT);
        console.error('Error parsing CSV:', e);
        toast.warning(`Unable to process CSV file.`);
      }
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
            {phase !== UploadPhase.FILE_SELECT ? (
              <UploadProgress
                onReturn={returnToFileUpload}
                onRestart={onUpload}
                {...{ feed, progress, phase }}
              />
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
