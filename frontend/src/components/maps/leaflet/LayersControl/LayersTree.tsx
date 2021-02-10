import { Formik, Form as FormikForm, getIn, useFormikContext } from 'formik';
import { noop, flatten } from 'lodash';
import * as React from 'react';
import { ListGroup, Form } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import TreeMenu, { TreeMenuItem, TreeNode } from 'react-simple-tree-menu';
import 'react-simple-tree-menu/dist/main.css';
import styled from 'styled-components';
import { layersTree } from './data';
import * as L from 'leaflet';
import { useLeaflet } from 'react-leaflet';
import { ILayerItem } from './types';
import variables from '_variables.module.scss';

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
        color: ${variables.textColor};
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

const featureGroup = new L.FeatureGroup();
const LeafletListenerComp = () => {
  const { values } = useFormikContext<{ layers: ILayerItem[] }>();
  const { map } = useLeaflet();

  React.useEffect(() => {
    if (map) {
      featureGroup.addTo(map);
    }

    return () => {
      map?.removeLayer(featureGroup);
    };
  }, [map]);

  React.useEffect(() => {
    if (!!map) {
      const currentLayers = Object.keys((featureGroup as any)._layers)
        .map(k => (featureGroup as any)._layers[k])
        .map(l => l.options)
        .filter(x => !!x);
      const layers = flatten(values.layers.map(l => l.nodes)).filter((x: any) => x.on);
      const layersToAdd = layers.filter(
        (layer: any) => !currentLayers.find(x => x.key === layer.key),
      );
      const layersToRemove = currentLayers.filter(
        (layer: any) => !layers.find((x: any) => x.key === layer.key),
      );

      layersToAdd.forEach((node: any) => {
        const layer = L.tileLayer.wms(node.url, node);
        featureGroup.addLayer(layer);
      });

      featureGroup.eachLayer((layer: any) => {
        if (layersToRemove.find(l => l.key === layer?.options?.key)) {
          featureGroup.removeLayer(layer);
        }
      });
    }
  }, [values, map]);

  return null;
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
            <ParentNode key={node.key} id={node.key}>
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
            <LayerNode key={node.key} id={node.key}>
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

const layers = layersTree.map((parent, parentIndex) => {
  return {
    ...parent,
    nodes: parent.nodes?.map((node: any, index) => ({
      ...node,
      zIndex: (parentIndex + 1) * index,
      opacity: 0.3,
    })),
  };
});

/**
 * This component displays the layers group menu
 */
const LayersMenu: React.FC = () => {
  return (
    <Formik initialValues={{ layers }} onSubmit={noop}>
      {({ values }) => (
        <FormikForm>
          <LeafletListenerComp />
          <TreeMenu hasSearch={false} data={layersTree}>
            {({ items }) => {
              return <LayersTree items={items} />;
            }}
          </TreeMenu>
        </FormikForm>
      )}
    </Formik>
  );
};

export default LayersMenu;
