import './FileInput.scss';

import React from 'react';
import { BsFileEarmarkCheckFill } from 'react-icons/bs';
import { FaFileUpload } from 'react-icons/fa';

interface IFileInputProps {
  file?: File;
  onChange: (e: any) => void;
  onDrop: (e: any) => void;
}

export const FileInput = (props: IFileInputProps) => {
  const { file, onChange, onDrop } = props;

  return (
    <div
      id="file-upload"
      onClick={() => {
        document.getElementById('file-input')!.click();
      }}
      onDrop={onDrop}
      onDragOver={(e: any) => {
        e.preventDefault();
      }}
    >
      <div className="dashed-container">
        {file ? (
          <>
            <BsFileEarmarkCheckFill size={'7em'}></BsFileEarmarkCheckFill>
            <p>{file.name}</p>
          </>
        ) : (
          <>
            <FaFileUpload size={'7em'} />
            <p>Drag and drop or click to select file.</p>
          </>
        )}
      </div>
      <input
        id="file-input"
        type="file"
        accept=".csv,.CSV"
        style={{ width: 0 }}
        onChange={onChange}
      />
    </div>
  );
};
