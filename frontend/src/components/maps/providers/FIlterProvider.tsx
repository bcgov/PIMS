import * as React from 'react';
import { noop } from 'lodash';

const FilterContext = React.createContext<{
  changed: boolean;
  setChanged: (state: boolean) => void;
}>({ changed: true, setChanged: noop });

/**
 * Map filter change state manager,
 * helps the inventory layer zoom to the results when submitting the filter form
 */
export const FilterProvider: React.FC = ({ children }) => {
  // Default changed state to false on page load
  const [changed, setChanged] = React.useState(false);

  return (
    <FilterContext.Provider value={{ changed, setChanged }}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => React.useContext(FilterContext);
