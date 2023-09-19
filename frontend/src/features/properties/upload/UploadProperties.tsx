import { Button } from 'components/common/form';
import './UploadProperties.scss';

import React, { useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { FaFileUpload } from 'react-icons/fa';

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
                <div
                  id="file-upload"
                  onClick={() => {
                    document.getElementById('file-input')!.click();
                  }}
                >
                  <div className="dashed-container">
                    <FaFileUpload size={'7em'} />
                    {file ? <p>{file.name}</p> : <p>Drag and drop a file or click to upload.</p>}
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv,.CSV"
                    style={{ width: 0 }}
                    onChange={handleFileChange}
                  />
                </div>
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
