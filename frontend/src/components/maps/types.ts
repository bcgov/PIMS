import Supercluster from 'supercluster';
import { GeoJsonProperties } from 'geojson';
import { PropertyTypes } from 'constants/index';

export type ICluster<
  P extends GeoJsonProperties = Supercluster.AnyProps,
  C extends GeoJsonProperties = Supercluster.AnyProps
> = Supercluster.ClusterFeature<C> | Supercluster.PointFeature<P>;

/**
 * Property values for GIS features.
 */
export type PointFeature = Supercluster.PointFeature<{
  id: number;
  propertyTypeId: PropertyTypes;
  agencyId?: number;
  projectStatus?: string;
  name?: string;
  projectWorkflow?: string;
}>;
