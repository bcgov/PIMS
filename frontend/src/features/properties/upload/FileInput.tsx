import './FileInput.scss';

import React from 'react';
import { BsFileEarmarkCheckFill } from 'react-icons/bs';
import { FaFileUpload } from 'react-icons/fa';

/**
 * @interface
 * @description The properties passed to the FileInput component
 * @param {File} file The file to be uploaded
 * @param onChange The function to be called when the file is uploaded via click
 * @param onDrop The function to be called when a file is dropped on the component
 */
interface IFileInputProps {
  file?: File;
  onChange: (e: any) => void;
  onDrop: (e: any) => void;
}

/**
 * @description A file input element that allows for drag and drop options
 * @param {IFileInputProps} props The properties passed to the component
 * @returns {React.FC} A React component
 */
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
