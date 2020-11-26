import { Formik, Form as FormikForm, getIn, useFormikContext } from 'formik';
import { noop } from 'lodash';
import * as React from 'react';
import { ListGroup, Form } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import TreeMenu, { TreeMenuItem, TreeNode } from 'react-simple-tree-menu';
import 'react-simple-tree-menu/dist/main.css';
import styled from 'styled-components';
import { layersTree } from './data';

const ParentNode = styled(ListGroup.Item)`
  display: flex;
  align-items: center;
  padding-left: 0px;
  border: none;
  padding-top: 5px;
  padding-bottom: 5px;
  .form-group {
    .form-check {
      label {
        font-weight: bold;
        color: #494949;
        font-size: 13px;
      }
    }
  }
`;

const LayerNode = styled(ListGroup.Item)`
  display: flex;
  padding-left: 25px;
  border: none;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const OpenedIcon = styled(FaAngleDown)`
  margin-right: 10px;
  font-size: 15px;
`;

const ClosedIcon = styled(FaAngleRight)`
  margin-right: 10px;
  font-size: 15px;
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 0px;
  .form-check {
    display: flex;
    align-items: center;
    input {
      margin-top: 0px;
    }

    label {
      display: flex;
      align-items: center;
    }
  }
`;

const LayerColor = styled.div<{ color: string }>`
  width: 14px;
  height: 14px;
  background-color: ${({ color }) => color};
  margin-right: 5px;
`;

/**
 * Component to display Group Node as a formik field
 */
const ParentCheckbox: React.FC<{ name: string; label: string; index: number }> = ({
  name,
  label,
  index,
}) => {
  const { values, setFieldValue } = useFormikContext();

  const onChange = () => {
    const nextValue = !getIn(values, name);
    setFieldValue(name, nextValue);
    // Toggle children nodes
    const nodes = getIn(values, `layers[${index}].nodes`) || [];
    nodes.forEach((node: any, i: number) =>
      setFieldValue(`layers[${index}].nodes[${i}].on`, nextValue),
    );
  };

  return (
    <FormGroup>
      <Form.Check type="checkbox" checked={getIn(values, name)} onChange={onChange} label={label} />
    </FormGroup>
  );
};

/**
 * Component to display Layer Node as a formik field
 */
const LayerNodeCheckbox: React.FC<{ name: string; label: string; color: string }> = ({
  name,
  label,
  color,
}) => {
  const { values, setFieldValue } = useFormikContext();

  const onChange = () => {
    setFieldValue(name, !getIn(values, name));
  };

  return (
    <FormGroup>
      <Form.Check
        type="checkbox"
        checked={getIn(values, name)}
        onChange={onChange}
        label={
          <>
            {' '}
            {!!color && <LayerColor color={color} />} {label}
          </>
        }
      />
    </FormGroup>
  );
};

/**
 * This component displays the nested groups of layers
 */
const LayersTree: React.FC<{ items: TreeMenuItem[] }> = ({ items }) => {
  const { values } = useFormikContext<any>();

  const getParentIndex = (key: string, layers: TreeNode[]) => {
    return layers.findIndex(node => node.key === key);
  };

  const getLayerNodeIndex = (nodeKey: string, parentKey: string, layers: TreeNode[]) => {
    const parent = layers.find(node => node.key === parentKey);

    return (parent!.nodes as any).findIndex((node: TreeNode) => node.key === nodeKey);
  };

  return (
    <ListGroup>
      {items.map(node => {
        if (node.level === 0) {
          if (!node.hasNodes) {
            return null;
          }
          return (
            <ParentNode key={node.key}>
              {node.isOpen ? (
                <OpenedIcon onClick={node.toggleNode} />
              ) : (
                <ClosedIcon onClick={node.toggleNode} />
              )}
              <ParentCheckbox
                index={node.index}
                name={`layers[${node.index}].on`}
                label={node.label}
              />
            </ParentNode>
          );
        } else {
          return (
            <LayerNode key={node.key} onClick={node.onClick}>
              <LayerNodeCheckbox
                label={node.label}
                name={`layers[${getParentIndex(
                  node.parent,
                  values.layers as any,
                )}].nodes[${getLayerNodeIndex(
                  node.key.split('/')[1],
                  node.parent,
                  values.layers as any,
                )}].on`}
                color={node.color}
              />
            </LayerNode>
          );
        }
      })}
    </ListGroup>
  );
};

/**
 * This component displays the layers group menu
 */
const LayersMenu: React.FC = () => {
  return (
    <Formik initialValues={{ layers: layersTree }} onSubmit={noop}>
      {({ values }) => (
        <FormikForm>
          <TreeMenu hasSearch={false} data={layersTree}>
            {({ items }) => <LayersTree items={items} />}
          </TreeMenu>
        </FormikForm>
      )}
    </Formik>
  );
};

export default LayersMenu;
