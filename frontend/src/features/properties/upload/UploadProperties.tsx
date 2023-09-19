import { Button } from 'components/common/form';
import './UploadProperties.scss';

import React, { useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { FileInput } from './FileInput';

enum UploadPhase {
  FILE_SELECT,
  DATA_UPLOAD,
}

export const UploadProperties: React.FC = () => {
  const [file, setFile] = useState<File>();
  const [phase, setPhase] = useState<UploadPhase>(UploadPhase.FILE_SELECT);

  const handleFileChange = (e: any) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
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
                    onClick={() => {
                      setPhase(UploadPhase.DATA_UPLOAD);
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
