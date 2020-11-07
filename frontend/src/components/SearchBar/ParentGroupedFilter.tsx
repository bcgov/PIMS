import { SelectOption, SelectOptions } from 'components/common/form';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { groupBy, sortBy } from 'lodash';
import React, { Fragment } from 'react';
import { Highlighter, Menu, MenuItem } from 'react-bootstrap-typeahead';

interface IParentGroupedFilterProps {
  name: string;
  options: SelectOptions;
  className: string;
  inputSize?: 'small' | 'large';
  filterBy?: string[];
  placeholder?: string;
}

export const ParentGroupedFilter: React.FC<IParentGroupedFilterProps> = ({
  name,
  options,
  className,
  inputSize,
  filterBy,
  placeholder,
}) => {
  return (
    <TypeaheadField
      name={name}
      options={options}
      inputProps={{ className: className }}
      bsSize={inputSize}
      filterBy={filterBy}
      placeholder={placeholder}
      filter={true}
      renderMenu={(results, menuProps) => {
        const parents = groupBy(
          results.map((x: SelectOption) => {
            return {
              ...x,
              parentId: x.parentId || x.value,
            };
          }),
          x => x.parentId,
        );
        const items = Object.keys(parents)
          .sort()
          .map(parent => (
            <Fragment key={parent}>
              {!!results.find((x: SelectOption) => x.value === parent) && (
                <Menu.Header>
                  <b>{results.find(x => x.value === parent)?.label}</b>
                </Menu.Header>
              )}
              {sortBy(parents[parent], (x: SelectOption) => x.value).map((i, index) => {
                return (
                  <MenuItem key={index + 1} option={i} position={index + 1}>
                    <Highlighter>{i.label}</Highlighter>
                  </MenuItem>
                );
              })}
            </Fragment>
          ));

        return <Menu {...menuProps}>{items}</Menu>;
      }}
    />
  );
};
