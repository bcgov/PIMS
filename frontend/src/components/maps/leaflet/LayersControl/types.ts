import { WMSOptions } from 'leaflet';
import { TreeNodeInArray } from 'react-simple-tree-menu';

export interface ILayerItem extends TreeNodeInArray, WMSOptions {
  on?: boolean;
  url?: string;
}
