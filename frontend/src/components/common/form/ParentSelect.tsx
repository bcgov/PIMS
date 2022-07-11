import { getIn, useFormikContext } from 'formik';
import { groupBy, sortBy } from 'lodash';
import _ from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { Highlighter, Menu, MenuItem } from 'react-bootstrap-typeahead';
import styled from 'styled-components';

import { SelectOption, SelectOptions } from './Select';
import { TypeaheadField } from './Typeahead';

/** this styled component is used to help condtionally apply bold font weight to items that have been assigned the bold-item className */
const StyledMenuItemsDiv = styled.div`
  .bold-item {
    font-weight: bold;
  }
  overflow-x: hidden;
`;

interface IParentSelect {
  /** specify the field that is being accessed */
  field: string;
  /** give the component the desired options to group by parent with */
  options: SelectOptions;
  /** if you would like placeholder text within the input */
  placeholder?: string;
  /** filterBy is optional - if used can determine what you can filter with */
  filterBy?: string[];
  /** provide the opitional label text*/
  label?: string;
  /** flag used to control whehter to display red astrix indicating required */
  required?: boolean;
  /** determine whether this component is disabled or not */
  disabled?: boolean;
  /** set this flag if the grouped parent select will be used to make multiple selection */
  enableMultiple?: boolean;
  /** check to see whether reset button has been called to clear multiple selected */
  clearSelected?: boolean;
  /** reset state of clear selected via this component */
  setClearSelected?: Function;
  /** Event occurs when the selection changes. */
  onChange?: (vals: any) => void;
  /** get the component to select the item with closest label match to the input provided */
  selectClosest?: boolean;
  /** Transform value */
  convertValue?: (value: any) => any;
}

/** Component used to group children items with their parent.
 *  Can click the parent item as a value or the subsequent children
 **/
export const ParentSelect: React.FC<IParentSelect> = ({
  field,
  options,
  placeholder,
  filterBy,
  required,
  disabled,
  enableMultiple,
  clearSelected,
  setClearSelected,
  label,
  onChange,
  selectClosest,
  convertValue = value => value,
}) => {
  const { values, setFieldValue } = useFormikContext();
  const selected = getIn(values, field) as [];
  /** used to trigger onBlur so menu disappears on custom header click */
  const [clear, setClear] = useState(false);

  /** controls the multi selections displayed to the user */
  const [multiSelections, setMultiSelections] = React.useState<any>([]);
  /** parent id used to identify parent agencies with no children */
  const CHILDLESS_PARENT_ID = -1;

  /** wipe the selection from input on reset */
  useEffect(() => {
    clearSelected && setMultiSelections([]);
    setClearSelected && setClearSelected(false);
  }, [clearSelected, setClearSelected]);

  React.useEffect(() => {
    if (selected && !!selected.length && selected.some)
      setMultiSelections(options.filter(o => selected?.some(f => o.value === f)));
  }, [selected, options]);

  /** function that gets called when menu header is clicked */
  const handleMenuHeaderClick = (vals: SelectOption) => {
    setFieldValue(field, convertValue(vals.value));
    /** trigger ref in Typeahead to call onBlur so menu closes */
    setClear(true);
    onChange?.([vals]);
  };

  /** fill the multiselect enabled input to all the corresponding values */
  const handleMultiSelectHeaderClick = (vals: any) => {
    setMultiSelections(vals);
    setFieldValue(
      field,
      vals.map((x: any) => convertValue(x.value)),
    );
    setClear(true);
    onChange?.(vals);
  };

  const getOptionByValue = (value: any) => {
    if (value?.value) {
      return [value];
    }
    if (value !== undefined && !_.isEmpty(value?.toString())) {
      /** select appropriate agency to set the field value to when present */
      const option = options.find(x => x.value === value?.toString() || x.value === value);
      return option ? [option] : [];
    }
    return [];
  };

  return (
    <>
      <TypeaheadField
        label={label}
        disabled={disabled}
        clearMenu={clear}
        selectClosest={selectClosest}
        setClear={setClear}
        name={field}
        labelKey={option => `${option.label}`}
        onChange={(vals: any) => {
          if (enableMultiple) {
            setMultiSelections(vals);
            setFieldValue(
              field,
              vals.map((x: any) => convertValue(x.value)),
            );
          } else {
            setFieldValue(field, convertValue(getIn(vals[0], 'value')) ?? convertValue(vals[0]));
          }
          onChange?.(vals);
        }}
        multiple={enableMultiple}
        options={options}
        maxResults={options.length}
        bsSize={'large'}
        filterBy={filterBy}
        getOptionByValue={enableMultiple ? (value: any) => value : getOptionByValue}
        multiSelections={multiSelections}
        clearSelected={clearSelected}
        placeholder={placeholder}
        hideValidation
        required={required}
        renderMenu={(results, menuProps) => {
          const parents = results.filter(x => !x.parentId);
          const childless = parents.filter(
            p => !results.find(r => Number(r.parentId) === Number(p.value)),
          );

          // This assigns a specific id to childless parent agencies
          // Headers will not be displayed for these childless parent agencies but they will be displayed as regular options and grouped
          results = results.map(x => {
            return {
              ...x,
              parentId: !!childless.find(c => Number(c.value) === Number(x.value))
                ? CHILDLESS_PARENT_ID
                : x.parentId,
              parent: !!childless.find(c => Number(c.value) === Number(x.value))
                ? 'Childless'
                : x.parent,
            };
          });

          /** group the results by their desired parents */
          const resultGroup = groupBy(results, x => x.parentId);

          const items = Object.keys(resultGroup)
            .sort()
            .reverse()
            .map(parentId => (
              <Fragment key={parentId}>
                {!!results.find((x: SelectOption) => x.parentId === +parentId) &&
                  +parentId !== CHILDLESS_PARENT_ID && (
                    <Menu.Header
                      onClick={() =>
                        enableMultiple
                          ? handleMultiSelectHeaderClick(
                              results.filter(x => x.parentId === +parentId),
                            )
                          : handleMenuHeaderClick(options.find(x => x.value === parentId)!)
                      }
                    >
                      <b style={{ cursor: 'pointer' }}>
                        {results.find(x => x.parentId === +parentId)?.parent}
                      </b>
                    </Menu.Header>
                  )}
                {/* sorting results by value of the dropdown item */}
                {sortBy(resultGroup[parentId], (x: SelectOption) => x.value).map((i, index) => {
                  if (i.parent) {
                    return (
                      <StyledMenuItemsDiv key={index}>
                        <MenuItem
                          className={i.parentId === CHILDLESS_PARENT_ID ? 'bold-item' : 'menu-item'}
                          key={index + 1}
                          option={i}
                          position={index + 1}
                        >
                          <Highlighter search="">{i.label}</Highlighter>
                        </MenuItem>
                      </StyledMenuItemsDiv>
                    );
                  }
                  return null;
                })}
              </Fragment>
            ));
          return <Menu {...menuProps}>{items}</Menu>;
        }}
      />
    </>
  );
};
