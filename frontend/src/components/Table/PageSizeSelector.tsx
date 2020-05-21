import { Menu, IMenuItemProps } from 'components/menu/Menu';
import React from 'react';
import { Form } from 'react-bootstrap';
import { noop } from 'lodash';

interface IProps {
  options: number[];
  value: number;
  onChange: (size: number) => void;
  alignTop: boolean;
}

export const TablePageSizeSelector: React.FC<IProps> = ({ options, value, onChange, alignTop }) => {
  const [selected, setSelected] = React.useState(value);

  const handleValueChange = (selected: number) => {
    if (value !== selected) {
      setSelected(selected);
      onChange(selected);
    }
  };

  const pageSizeOptions: IMenuItemProps[] = options.map(option => ({
    label: option,
    value: option,
    onClick: () => handleValueChange(option),
  }));
  return (
    <Menu options={pageSizeOptions} width="60px" alignTop={alignTop}>
      <div style={{ display: 'flex' }}>
        <span>Show</span>
        <Form.Control
          size="sm"
          value={`${selected}`}
          type="number"
          style={{ width: 50, marginLeft: 10, marginRight: 10 }}
          onChange={noop}
        />
        <span>Entries</span>
      </div>
    </Menu>
  );
};
