import React from 'react';

import * as styled from './styled';

export interface ITabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: React.ReactElement[];
}

export const Tabs: React.FC<ITabsProps> = ({ tabs, children }) => {
  return (
    <styled.Tabs className="tabs">
      <ul className="tab">{tabs}</ul>
      <div className="tab-body">{children}</div>
    </styled.Tabs>
  );
};
