import * as React from 'react';

/**
 * Help Text for the project assessment notes.
 */
export const ProjectAssessmentNotesHelpText = () => {
  return (
    <p>
      <strong>Private Notes:</strong> The user who submitted the project will not be able to see
      these notes.
      <br />
      <strong>Public Notes:</strong> These notes are shared between the reviewer and the user who
      submitted the project.
    </p>
  );
};
