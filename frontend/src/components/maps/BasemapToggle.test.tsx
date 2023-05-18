import Adapter from '@cfaester/enzyme-adapter-react-18';
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';

import BasemapToggle, { BaseLayer } from './BasemapToggle';

Enzyme.configure({ adapter: new Adapter() });

const toggle = jest.fn();

const baseMaps = [
  {
    name: 'Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    thumbnail: 'streets.jpg',
  },
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
    thumbnail: 'satellite.jpg',
  },
] as BaseLayer[];

// Just changes default layer - using this to simulate a toggle
const toggledLayers = [
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
    thumbnail: 'satellite.jpg',
  },
  {
    name: 'Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    thumbnail: 'streets.jpg',
  },
] as BaseLayer[];

const component = mount(<BasemapToggle baseLayers={baseMaps} onToggle={toggle} />);

it('renders correctly - defaults on street layer', () => {
  const tree = renderer.create(<BasemapToggle baseLayers={baseMaps} onToggle={toggle} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('toggle handler called correctly', () => {
  component.prop('onToggle')();
  expect(toggle).toBeCalledTimes(1);
});

it('thumbnail shows satellite layer when on street layer', () => {
  expect(component.find('img').prop('src')).toEqual('satellite.jpg');
});

it('thumbnail shows street layer when on satellite layer', () => {
  const component = mount(<BasemapToggle baseLayers={toggledLayers} onToggle={toggle} />);
  expect(component.find('img').prop('src')).toEqual('streets.jpg');
});

// it('handles updating state correctly', ()=> {
//     component.setState({updating: true});
//     expect(component.find("div").first().prop("className")).toEqual("basemap-container view-busy");
// });
