import React from 'react';
import TooltipWrapper from '../TooltipWrapper';
import { FaSearch } from 'react-icons/fa';
import { Button, ButtonProps } from '.';

/**
 * SearchButton displaying a magnifying glass icon, used to initiate search/filter actions.
 * @param param0
 */
const SearchButton: React.FC<ButtonProps> = ({ ...props }) => {
  return (
    <TooltipWrapper toolTipId="map-filter-search-tooltip" toolTip="Search">
      <Button
        id="search-button"
        type="submit"
        className={props.className ?? 'bg-warning'}
        {...props}
        icon={<FaSearch size={20} />}
      />
    </TooltipWrapper>
  );
};

export default SearchButton;
