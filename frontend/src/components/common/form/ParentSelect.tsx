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
  /** if this component is being used as a filter do not pre populate the value */
  isFilter?: boolean;
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
  isFilter,
  label,
}) => {
  const { setFieldValue, values } = useFormikContext();
  const value = getIn(values, field);
  /** control the selection of the typeahead component */
  const [selected, setSelected] = useState<SelectOption[]>([]);
  /** determine whether the initial value has been loaded into the component or not */
  const [loaded, setLoaded] = useState(false);
  /** used to trigger onBlur so menu disappears on custom header click */
  const [clear, setClear] = useState(false);
  /** select appropriate agency to set the field value to when present */
  const agency = value ? options.find(x => x.value === value.toString()) : null;

  useEffect(() => {
    if (value && !loaded && !isFilter) {
      if (value.value) {
        setFieldValue(field, value);
      } else if (value && !value.value) {
        setFieldValue(field, agency);
      } else {
        setFieldValue(field, agency);
        setLoaded(true);
      }
    }
  }, [value, loaded, setFieldValue, isFilter, field, agency]);

  /** function that gets called when menu header is clicked */
  const handleMenuHeaderClick = (x: SelectOption) => {
    setFieldValue(field, x);
    setSelected([x]);
    /** trigger ref in Typeahead to call onBlur so menu closes */
    setClear(true);
  };

  return (
    <>
      {label && <Label required={required}>{label}</Label>}
      <TypeaheadField
        disabled={disabled}
        clearMenu={clear}
        name={field}
        labelKey={option => `${option.label}`}
        onChange={vals => {
          setSelected(vals);
          setFieldValue(field, getIn(vals[0], 'name') ?? vals[0]);
        }}
        selected={selected}
        options={options}
        bsSize={'large'}
        filterBy={filterBy}
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
                    onClick={() => handleMenuHeaderClick(results.find(x => x.value === parent)!)}
                  >
                    <b style={{ cursor: 'pointer' }}>
                      {results.find(x => x.value === parent)?.label}
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
