import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from 'react-leaflet';

const LeafControl = L.Control.extend({
  options: {
    className: '',
    onOff: '',
    handleOff: function noop() {},
  },

  onAdd() {
    const div = L.DomUtil.create('div', this.options.className);
    // clicks and scroll events for this control will NOT send events to map behind it
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
  },

  onRemove(map: L.Map) {
    if (this.options.onOff) {
      map.off(this.options.onOff, this.options.handleOff, this);
    }

    return this;
  },
});

export const ControlPanel: React.FC<React.PropsWithChildren<L.ControlOptions>> = (props) => {
  const map = useMap();
  const elementRef = useRef(new LeafControl(props));
  const instance = elementRef.current;
  const positionRef = useRef(props.position);
  const { position } = props;

  useEffect(
    function addControl() {
      map.addControl(instance);

      return function removeControl() {
        map.removeControl(instance);
      };
    },
    [map, instance],
  );

  // update control when position changes
  useEffect(
    function updateControl() {
      if (position != null && position !== positionRef.current) {
        instance.setPosition(position);
        positionRef.current = position;
      }
    },
    [instance, position],
  );

  const [, setValue] = useState(0);
  useEffect(() => {
    // Origin: https://github.com/LiveBy/react-leaflet-control/blob/master/lib/control.jsx
    // This is needed because the control is only attached to the map in
    // MapControl's componentDidMount, so the container is not available
    // until this is called. We need to now force a render so that the
    // portal and children are actually rendered.

    setValue((value) => value + 1); // update the state to force render
  }, []);

  // after control has been added to the map, render its children
  const contentNode = instance.getContainer();
  return contentNode ? createPortal(props.children, contentNode) : null;
};

export default ControlPanel;
