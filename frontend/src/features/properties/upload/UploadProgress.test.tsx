import { render } from '@testing-library/react';
import React from 'react';

import { UploadProgress } from './UploadProgress';
import { IFeedObject, IProgressState, UploadPhase } from './UploadProperties';

describe('Testing Progress section for CSV Upload', () => {
  const startingProgress: IProgressState = {
    message: 'starting message',
    totalRecords: 10,
    successes: 0,
    failures: 0,
  };
  let progress: IProgressState = startingProgress;
  let feed: IFeedObject[] = [];
  let phase: UploadPhase = UploadPhase.FILE_SELECT;
  const { queryByText } = render(<UploadProgress {...{ progress, feed, phase }} />);

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
        success: true,
      },
      {
        pid: '4321',
        success: false,
      },
    );
    phase = UploadPhase.DATA_UPLOAD;
    const { queryByText } = render(<UploadProgress {...{ progress, feed, phase }} />);
    expect(queryByText(/PID 1234 uploaded successfully/)).toBeInTheDocument();
    expect(queryByText(/PID 4321 failed to upload/)).toBeInTheDocument();
  });

  it('Final report is visible when upload complete', () => {
    progress = { ...progress, message: 'Upload Complete', successes: 5, failures: 5 };
    phase = UploadPhase.DONE;
    const { queryByText } = render(<UploadProgress {...{ progress, feed, phase }} />);
    expect(queryByText(/Upload Complete/)).toBeInTheDocument();
    expect(queryByText(/Download Results/)).toBeInTheDocument();
    expect(queryByText(/Successes: 5/)).toBeInTheDocument();
    expect(queryByText(/Failures: 5/)).toBeInTheDocument();
  });
});
