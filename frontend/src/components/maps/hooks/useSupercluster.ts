import { useRef, useState } from 'react';
import { BBox, GeoJsonProperties } from 'geojson';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import deepEqual from 'dequal';
import Supercluster from 'supercluster';
import { ICluster } from '../types';

interface SuperclusterOptions<P, C> extends Supercluster.Options<P, C> {
  /** Optionally enable clusters recalculation */
  enableClustering?: boolean;
}
export interface UseSuperclusterProps<P, C> {
  points: Array<Supercluster.PointFeature<P>>;
  bounds?: BBox;
  zoom: number;
  options?: SuperclusterOptions<P, C>;
}

const useSupercluster = <
  P extends GeoJsonProperties = Supercluster.AnyProps,
  C extends GeoJsonProperties = Supercluster.AnyProps
>({
  points,
  bounds,
  zoom,
  options,
}: UseSuperclusterProps<P, C>) => {
  const superclusterRef = useRef<Supercluster<P, C>>();
  const pointsRef = useRef<Array<Supercluster.PointFeature<P>>>();
  const [clusters, setClusters] = useState<Array<ICluster<P, C>>>([]);
  const zoomInt = Math.round(zoom);

  // use deep-equals to avoid infinite re-rendering when objects have same data but are different JS instances
  useDeepCompareEffect(() => {
    if (!superclusterRef.current || !deepEqual(pointsRef.current, points)) {
      superclusterRef.current = new Supercluster(options);
      superclusterRef.current.load(points);
    }

    /**
     * Only create clusters when zooming to results is done OR number of points is
     * greater than 100 (avoid perfomrance issues when rendering all points)
     */
    if (bounds && (options?.enableClustering || points.length > 100)) {
      setClusters(superclusterRef.current.getClusters(bounds, zoomInt));
    } else {
      setClusters(points);
    }

    pointsRef.current = points;
  }, [points, bounds, zoomInt]);

  return { clusters, supercluster: superclusterRef.current };
};

export default useSupercluster;
