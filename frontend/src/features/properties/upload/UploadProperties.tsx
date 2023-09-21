import './UploadProperties.scss';

import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { Button } from '../../../components/common/form/Button';
import { csvFileToPropertyModel, IPropertyModel } from '../../../utils/csvToPropertyModel';
import { FileInput } from './FileInput';
// import { useApi } from 'hooks/useApi';

enum UploadPhase {
  FILE_SELECT,
  DATA_UPLOAD,
}

export const UploadProperties: React.FC = () => {
  const [file, setFile] = useState<File>();
  const [phase, setPhase] = useState<UploadPhase>(UploadPhase.FILE_SELECT);
  // const api = useApi();

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
      console.log(convertedCsvData);
      // Split array into chunks and send to endpoint (API restriction)
      const chunkSize = 100;
      for (let i = 0; i < convertedCsvData.length; i += chunkSize) {
        const currentChunk = convertedCsvData.slice(i, i + chunkSize);
        console.log(currentChunk);
        try {
          // Send to API
          // const response = await api.importProperties(currentChunk);
          // Check response for failed attempts
          // Update progress state
        } catch (e: unknown) {
          console.error('Following properties failed', (e as AxiosError).response?.data);
        }
      }
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
              <>
                <p>Progress Bar here</p>
                <p>Description of Info below & eventual download results</p>
                <p>Results feed</p>
              </>
            ) : (
              <>
                <FileInput file={file} onChange={handleFileChange} />
                {file ? (
                  <Button
                    id="upload-button"
                    // onClick={() => {
                    //   setPhase(UploadPhase.DATA_UPLOAD);
                    // }}
                    onClick={onUpload}
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
