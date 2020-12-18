import { getIn, useFormikContext } from 'formik';
import { groupBy, sortBy } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { Highlighter, Menu, MenuItem } from 'react-bootstrap-typeahead';
import { Label } from '../Label';
import { SelectOption, SelectOptions } from './Select';
import { TypeaheadField } from './Typeahead';

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
}) => {
  const { setFieldValue, values } = useFormikContext();
  const value = getIn(values, field);
  /** determine whether the initial value has been loaded into the component or not */
  const [loaded, setLoaded] = useState(false);
  /** used to trigger onBlur so menu disappears on custom header click */
  const [clear, setClear] = useState(false);
  /** select appropriate agency to set the field value to when present */
  const option = value ? options.find(x => x.value === value.toString()) : null;
  /** controls the multi selections displayed to the user */
  const [multiSelections, setMultiSelections] = React.useState<any>([]);

  useEffect(() => {
    if (!loaded) {
      if (value !== undefined) {
        if (value?.value) {
          setFieldValue(field, value);
        } else if (value && !value.value) {
          setFieldValue(field, option);
        } else {
          setFieldValue(field, option);
          setLoaded(true);
        }
      }
    }
  }, [value, loaded, setFieldValue, field, option]);

  /** wipe the selection from input on reset */
  useEffect(() => {
    clearSelected && setMultiSelections([]);
    setClearSelected && setClearSelected(false);
  }, [clearSelected, setClearSelected]);

  /** function that gets called when menu header is clicked */
  const handleMenuHeaderClick = (x: SelectOption) => {
    setFieldValue(field, x);
    /** trigger ref in Typeahead to call onBlur so menu closes */
    setClear(true);
  };

  /** fill the multiselect enabled input to all the corresponding values */
  const handleMultiSelectHeaderClick = (x: any) => {
    setMultiSelections(x);
    setFieldValue(
      field,
      x.map((x: any) => x.value),
    );
    setClear(true);
  };

  return (
    <>
      {label && <Label required={required}>{label}</Label>}
      <TypeaheadField
        disabled={disabled}
        clearMenu={clear}
        setClear={setClear}
        name={field}
        labelKey={option => `${option.label}`}
        onChange={(vals: any) => {
          if (enableMultiple) {
            setMultiSelections(vals);
            setFieldValue(
              field,
              vals.map((x: any) => x.value),
            );
          } else {
            setFieldValue(field, getIn(vals[0], 'name') ?? vals[0]);
          }
        }}
        multiple={enableMultiple}
        options={options}
        bsSize={'large'}
        filterBy={filterBy}
        getOptionByValue={
          enableMultiple
            ? (value: any) => value
            : (value: any) => (!!value ? ([value] as any[]) : ([] as any[]))
        }
        multiSelections={multiSelections}
        clearSelected={clearSelected}
        placeholder={placeholder}
        hideValidation
        renderMenu={(results, menuProps) => {
          const parents = groupBy(
            results.map((x: SelectOption) => {
              return {
                ...x,
                parentId: x.parentId,
              };
            }),
            x => x.parentId,
          );
          const items = Object.keys(parents)
            .sort()
            .map(parent => (
              <Fragment key={parent}>
                {!!results.find((x: SelectOption) => x.value === parent) && (
                  <Menu.Header
                    onClick={() =>
                      enableMultiple
                        ? handleMultiSelectHeaderClick(
                            results.filter(x => x.parentId?.toString() === parent),
                          )
                        : handleMenuHeaderClick(results.find(x => x.value === parent)!)
                    }
                  >
                    <b style={{ cursor: 'pointer' }}>
                      {field === 'statusId'
                        ? results.find(x => x.parentId?.toString() === parent)?.parent
                        : options.find(x => x.value === parent)?.label}
                    </b>
                  </Menu.Header>
                )}
                {sortBy(parents[parent], (x: SelectOption) => x.value).map((i, index) => {
                  if (i.parent) {
                    return (
                      <MenuItem key={index + 1} option={i} position={index + 1}>
                        <Highlighter search="">{i.label}</Highlighter>
                      </MenuItem>
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
