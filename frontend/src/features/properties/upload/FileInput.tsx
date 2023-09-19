import './FileInput.scss';

import React from 'react';
import { FaFileUpload } from 'react-icons/fa';

interface IFileInputProps {
  file?: File;
  onChange: (e: any) => void;
}

export const FileInput = (props: IFileInputProps) => {
  const { file, onChange } = props;
  return (
    <div
      id="file-upload"
      onClick={() => {
        document.getElementById('file-input')!.click();
      }}
    >
      <div className="dashed-container">
        <FaFileUpload size={'7em'} />
        {file ? <p>{file.name}</p> : <p>Drag and drop or click to select file.</p>}
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
