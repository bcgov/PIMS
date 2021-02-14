import React from 'react';

interface IAbbreviateTextProps {
  /** the text/title to display */
  text: string;
  /** the max display length of the above string */
  maxLength: number;
}

/**
 * Component that conditionally displays a p or abbr if the passed in text is too long.
 * @param {IAbbreviateTextProps} param0
 */
const AbbreviatedText: React.FunctionComponent<IAbbreviateTextProps &
  React.HTMLAttributes<HTMLDivElement>> = ({ text, maxLength, ...rest }) => {
  return text.length < maxLength ? (
    <p {...rest}>{text}</p>
  ) : (
    <abbr title={text} {...rest}>
      {text.substr(0, maxLength)}
    </abbr>
  );
};

export default AbbreviatedText;
