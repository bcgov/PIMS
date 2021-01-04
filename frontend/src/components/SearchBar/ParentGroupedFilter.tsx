import { SelectOption, SelectOptions } from 'components/common/form';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { getIn, useFormikContext } from 'formik';
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
  hideParent?: boolean;
}

export const ParentGroupedFilter: React.FC<IParentGroupedFilterProps> = ({
  name,
  options,
  className,
  inputSize,
  filterBy,
  placeholder,
  hideParent,
  ...rest
}) => {
  const { setFieldValue } = useFormikContext();
  return (
    <TypeaheadField
      {...rest}
      name={name}
      options={options}
      inputProps={{ className: className }}
      bsSize={inputSize}
      filterBy={filterBy}
      placeholder={placeholder}
      onChange={vals => {
        setFieldValue(name, getIn(vals[0], 'name') ?? vals[0]);
      }}
      hideValidation
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
              {!hideParent && !!results.find((x: SelectOption) => x.value === parent) && (
                <Menu.Header>
                  <b>{results.find(x => x.value === parent)?.label}</b>
                </Menu.Header>
              )}
              {sortBy(parents[parent], (x: SelectOption) => x.value).map((i, index) => {
                return (
                  <MenuItem key={index + 1} option={i} position={index + 1}>
                    <Highlighter search="">{i.label}</Highlighter>
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
