import {
  Layer,
  Marker,
  Map,
  PolylineOptions,
  Point as LeafletPoint,
  Polyline as LeafletPolyline,
  LatLng,
  LatLngExpression,
  GeoJSON,
  LeafletMouseEvent,
} from 'leaflet';
import { AnyProps, PointFeature } from 'supercluster';
import { ICluster } from 'hooks/useSupercluster';

export interface SpiderfierOptions {
  /** Increase from 1 to increase the distance away from the center that spiderfied markers are placed. Use if you are using big marker icons (Default: 1). */
  spiderfyDistanceMultiplier: number;
  /** Allows you to specify PolylineOptions to style spider legs. By default, they are `{ weight: 1.5, color: '#222', opacity: 0.5 }`. */
  spiderLegPolylineOptions: PolylineOptions;
  /** A function that returns the cluster ID */
  getClusterId(cluster: ICluster): number;
  /** A function that returns all the points of a cluster */
  getClusterPoints(cluster: ICluster): Array<PointFeature<AnyProps>>;
  /** Adds a GeoJSON object to the layer. */
  pointToLayer(geoJsonPoint: PointFeature<AnyProps>, latlng: LatLngExpression): Marker;
  /** Map pin click handler */
  onMarkerClick?: (event: LeafletMouseEvent) => void;
}

const _defaults: SpiderfierOptions = {
  spiderfyDistanceMultiplier: 1,
  spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },
  getClusterId: () => {
    throw new Error('Must supply getClusterId callback');
  },
  getClusterPoints: () => {
    throw new Error('Must supply getClusterPoints callback');
  },
  pointToLayer: () => {
    throw new Error('Must supply pointToLayer callback');
  },
  onMarkerClick: () => {},
};

/** Deals with overlapping markers in the Leaflet maps API, Google Earth-style */
export class Spiderfier {
  private twoPI = Math.PI * 2;
  private circleFootSeparation = 25; // related to circumference of circle
  private circleStartAngle = 0;

  private spiralFootSeparation = 28; // related to size of spiral (experiment!)
  private spiralLengthStart = 11;
  private spiralLengthFactor = 5;

  // shows a spiral instead of circle from this marker count upwards.
  // 0 -> always spiral; Infinity -> always circle
  private circleSpiralSwitchover = 9;

  // internal state - the currently spiderfied cluster (if any)
  private cluster: ICluster | null = null;
  private markers: Marker[] = [];
  private legs: LeafletPolyline[] = [];

  options: SpiderfierOptions;

  constructor(public map: Map, options: Partial<SpiderfierOptions> = {}) {
    this.options = { ..._defaults, ...options };
  }

  // expand a cluster (spiderfy)
  spiderfy(cluster: ICluster) {
    if (this.cluster === cluster || cluster == null) {
      return;
    }

    // shrink expanded clusters (if any) - only one cluster expanded at a time
    this.unspiderfy();
    this.cluster = cluster;

    let positions: LeafletPoint[];
    const centerLatlng = GeoJSON.coordsToLatLng(cluster?.geometry?.coordinates as [number, number]);
    const centerXY = this.map.latLngToLayerPoint(centerLatlng); // screen coordinates
    const clusterPoints = this.options.getClusterPoints(cluster);

    if (clusterPoints.length >= this.circleSpiralSwitchover) {
      positions = this.generatePointsSpiral(clusterPoints.length, centerXY);
    } else {
      positions = this.generatePointsCircle(clusterPoints.length, centerXY);
    }

    // add expanded cluster points to map
    this.addToMap(centerXY, clusterPoints, positions);
  }

  private addToMap(
    centerXY: LeafletPoint,
    geojsonPoints: PointFeature<AnyProps>[],
    positions: LeafletPoint[],
  ) {
    const { spiderLegPolylineOptions: legOptions, pointToLayer, onMarkerClick } = this.options;
    const centerLatLng = this.map.layerPointToLatLng(centerXY);

    let newPos: LatLng;
    let leg: LeafletPolyline & AnyProps;
    let geojson: PointFeature<AnyProps>;
    let m: Marker & AnyProps; // the pins within an expanded cluster

    for (let i = 0; i < geojsonPoints.length; i++) {
      newPos = this.map.layerPointToLatLng(positions[i]);
      geojson = geojsonPoints[i];
      m = pointToLayer(geojson, newPos);
      m.feature = GeoJSON.asFeature(geojson) as PointFeature<AnyProps>;
      m._spiderfied = true; // "mark" the pins and spider legs so they can be removed later

      if (onMarkerClick) {
        m.on('click', onMarkerClick);
      }

      // add the leg before the marker, so that in case the latter is a circleMarker, the leg is behind it.
      leg = new LeafletPolyline([centerLatLng, newPos], legOptions);
      leg._spiderfied = true;
      this.map.addLayer(leg);

      // now add the marker.
      if (m.setZIndexOffset) {
        m.setZIndexOffset(1000000); // make these appear on top of EVERYTHING
      }

      this.map.addLayer(m);
    }
  }

  // shrink an expanded cluster (unspiderfy)
  unspiderfy() {
    this.map.eachLayer((layer: Layer & AnyProps) => {
      if (layer._spiderfied) {
        layer.remove();
        delete layer._spiderfied;
      }
    });

    this.cluster = null;
  }

  private generatePointsCircle(count: number, center: LeafletPoint): LeafletPoint[] {
    const circumference =
      this.options.spiderfyDistanceMultiplier * this.circleFootSeparation * (2 + count);
    const angleStep = this.twoPI / count;
    let legLength = circumference / this.twoPI; //radius from circumference
    let angle;
    const result: LeafletPoint[] = [];

    legLength = Math.max(legLength, 35); // Minimum distance to get outside the cluster icon.

    // Clockwise, like spiral.
    for (let i = 0; i < count; i++) {
      angle = this.circleStartAngle + i * angleStep;
      result.push(
        new LeafletPoint(
          center.x + legLength * Math.cos(angle),
          center.y + legLength * Math.sin(angle),
        ).round(),
      );
    }

    return result;
  }

  private generatePointsSpiral(count: number, center: LeafletPoint): LeafletPoint[] {
    const spiderfyDistanceMultiplier = this.options.spiderfyDistanceMultiplier;
    const separation = spiderfyDistanceMultiplier * this.spiralFootSeparation;
    const lengthFactor = spiderfyDistanceMultiplier * this.spiralLengthFactor * this.twoPI;
    let legLength = spiderfyDistanceMultiplier * this.spiralLengthStart;
    let angle = 0;
    const result: LeafletPoint[] = [];

    // Higher index, closer position to cluster center.
    for (let i = count; i >= 0; i--) {
      // Skip the first position, so that we are already farther from center and we avoid
      // being under the default cluster icon (especially important for Circle Markers).
      if (i < count) {
        result.push(
          new LeafletPoint(
            center.x + legLength * Math.cos(angle),
            center.y + legLength * Math.sin(angle),
          ).round(),
        );
      }
      angle += separation / legLength + i * 0.0005;
      legLength += lengthFactor / angle;
    }
    return result;
  }
}
