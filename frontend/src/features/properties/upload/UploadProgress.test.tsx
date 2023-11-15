import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { UploadProgress } from './UploadProgress';
import { IFeedObject, IProgressState, UploadPhase } from './UploadProperties';

describe('Testing Progress section for CSV Upload', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const startingProgress: IProgressState = {
    message: 'starting message',
    totalRecords: 10,
    successes: 0,
    failures: 0,
  };
  let progress: IProgressState = startingProgress;
  let feed: IFeedObject[] = [];
  let phase: UploadPhase = UploadPhase.FILE_SELECT;
  const { queryByText, queryAllByText } = render(<UploadProgress {...{ progress, feed, phase }} />);

  beforeEach(() => {
    progress = startingProgress;
    feed = [];
  });

  it('Can see initial starting text', () => {
    expect(queryByText(/Do not leave the page or close the window/)).toBeInTheDocument();
    expect(queryByText(/starting message/)).toBeInTheDocument();
  });

  it('Cannot see the final report text at first', () => {
    expect(queryByText(/Upload completed/)).not.toBeInTheDocument();
    expect(queryByText(/Download Results/)).not.toBeInTheDocument();
  });

  it('Items from the feed are displayed', () => {
    feed.push(
      {
        pid: '1234',
        name: 'Property 1',
        added: true,
        updated: false,
        type: 'Land',
      },
      {
        pid: '4321',
        name: 'Property 2',
        added: false,
        updated: false,
        type: 'Building',
        error: 'Big Error',
      },
    );
    phase = UploadPhase.DATA_UPLOAD;
    const { queryByText } = render(<UploadProgress {...{ progress, feed, phase }} />);
    expect(queryByText(/Parcel with PID 1234 added successfully/)).toBeInTheDocument();
    expect(queryByText(/Building with PID 4321 failed to upload/)).toBeInTheDocument();
  });

  it('Final report is visible when upload complete', () => {
    progress = { ...progress, message: 'Upload Complete', successes: 5, failures: 5 };
    phase = UploadPhase.DONE;
    const { queryByText } = render(<UploadProgress {...{ progress, feed, phase }} />);
    expect(queryByText(/Upload Complete/)).toBeInTheDocument();
    expect(queryByText(/Download Results/)).toBeInTheDocument();
    expect(queryAllByText(/Successes: 5/)).toHaveLength(2); // Once for accordion, once for summary
    expect(queryAllByText(/Failures: 5/)).toHaveLength(2);
  });

  it('Buttons in final report are clickable', async () => {
    progress = { ...progress, message: 'Upload Complete', successes: 5, failures: 5 };
    phase = UploadPhase.DONE;
    const onReturn = jest.fn();
    const onRestart = jest.fn();
    const { container } = render(
      <UploadProgress {...{ progress, feed, phase, onRestart, onReturn }} />,
    );
    const restartButton = container.querySelector('#restart-upload-button');
    const returnButton = container.querySelector('#return-to-upload-button');

    await waitFor(() => {
      fireEvent.click(restartButton!);
      fireEvent.click(returnButton!);
    });

    expect(onReturn).toHaveBeenCalledTimes(1);
    expect(onRestart).toHaveBeenCalledTimes(1);

    // Download button
    const downloadButton = container.querySelector('#download-results-button');
    const downloadSpy = jest.spyOn(document, 'createElement');
    window.URL.createObjectURL = jest.fn(() => 'fileString');
    await waitFor(() => {
      fireEvent.click(downloadButton!);
    });
    expect(downloadSpy).toHaveBeenCalledTimes(1);
  });
});
