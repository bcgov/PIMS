import { PropertyTypes } from './../../actions/parcelsActions';
import Supercluster from 'supercluster';
import { GeoJsonProperties } from 'geojson';

export type ICluster<
  P extends GeoJsonProperties = Supercluster.AnyProps,
  C extends GeoJsonProperties = Supercluster.AnyProps
> = Supercluster.ClusterFeature<C> | Supercluster.PointFeature<P>;

export type PointFeature = Supercluster.PointFeature<{
  propertyId: number;
  propertyTypeId: PropertyTypes;
  projectStatus?: string;
  name?: string;
}>;
