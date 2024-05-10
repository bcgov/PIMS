import {
  GeoJSON,
  LatLng,
  Layer,
  Map,
  Marker,
  Point as LeafletPoint,
  PolylineOptions,
} from 'leaflet';
import { cloneDeep } from 'lodash';
import { AnyProps } from 'supercluster';

import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { ClusterGeo } from '@/components/map/InventoryLayer';

export interface SpiderfierOptions {
  /** Increase from 1 to increase the distance away from the center that spiderfied markers are placed. Use if you are using big marker icons (Default: 1). */
  spiderfyDistanceMultiplier: number;
  /** Allows you to specify PolylineOptions to style spider legs. By default, they are `{ weight: 1.5, color: '#222', opacity: 0.5 }`. */
  spiderLegPolylineOptions: PolylineOptions;
  /** A function that returns all the points of a cluster */
  getClusterPoints(clusterId: number): Array<PropertyGeo & ClusterGeo>;
}

const getClusterId = (cluster: ClusterGeo) => cluster.properties.cluster_id;

const defaultOptions: SpiderfierOptions = {
  spiderfyDistanceMultiplier: 1,
  spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },
  getClusterPoints: null as any,
};

/**
 * Spiderfier class for expanding and displaying cluster points on a map.
 */
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
  private cluster: (PropertyGeo & ClusterGeo) | null = null;

  options: SpiderfierOptions;

  constructor(
    public map: Map,
    options: Partial<SpiderfierOptions> = {},
  ) {
    this.options = { ...defaultOptions, ...options };
    // check required values - throws an error if callbacks are null
    const { getClusterPoints } = this.options;
    if (getClusterPoints === null || undefined)
      throw new Error('Must supply getClusterPoints callback');
  }

  /**
   * Expands a cluster and displays its individual points on the map.
   *
   * @param cluster - The cluster to be expanded, represented by a PropertyGeo object with ClusterGeo properties.
   * @returns An object with optional properties 'lines' and 'markers' representing the added lines and markers on the map.
   */
  spiderfy(cluster: PropertyGeo & ClusterGeo): { lines?: any[]; markers?: any[] } {
    const { getClusterPoints } = this.options;

    // only one cluster expanded at a time
    if (this.cluster === cluster || cluster == null) {
      this.cluster = null;
      this.unspiderfy();
      return {};
    }
    this.unspiderfy();
    this.cluster = cluster;
    const centerLatlng = GeoJSON.coordsToLatLng(cluster?.geometry?.coordinates as [number, number]);
    const centerXY = this.map.latLngToLayerPoint(centerLatlng); // screen coordinates
    const clusterId = getClusterId(cluster);
    // cloneDeep from lodash was in the orginal. Not in our package, but seems to work regardless.
    const children = getClusterPoints(clusterId).map((p) => cloneDeep(p)); // work with a copy of the data

    // To spiral or to circle
    let positions: LeafletPoint[];
    if (children.length >= this.circleSpiralSwitchover) {
      positions = this.generatePointsSpiral(children.length, centerXY);
    } else {
      positions = this.generatePointsCircle(children.length, centerXY);
    }

    // add expanded cluster points to map
    const results = this.addToMap(centerLatlng, children, positions);

    return results;
  }

  /**
   * Adds the expanded cluster points to the map.
   *
   * @param centerLatLng - The center LatLng of the cluster.
   * @param points - An array of PropertyGeo objects representing the cluster points.
   * @param positions - An array of LeafletPoint objects representing the positions of the cluster points on the map.
   * @returns An object with optional properties 'lines' and 'markers' representing the added lines and markers on the map.
   */
  private addToMap(
    centerLatLng: LatLng,
    points: Array<PropertyGeo>,
    positions: Array<LeafletPoint>,
  ): { lines?: any[]; markers?: any[] } {
    const { spiderLegPolylineOptions: legOptions } = this.options;

    let newPos: LatLng;
    let geojson: PropertyGeo;
    const markers: any[] = [];
    const lines: any[] = [];
    const centerAdjustment = 0.00003; // Centre is slightly off.
    for (let i = 0; i < points.length; i++) {
      newPos = this.map.layerPointToLatLng(positions[i]);
      geojson = points[i];
      markers.push({ ...geojson, position: newPos });
      lines.push({
        coords: [
          [centerLatLng.lat - centerAdjustment, centerLatLng.lng + centerAdjustment],
          newPos,
        ],
        options: legOptions,
      });
    }

    return { lines, markers };
  }

  /**
   * Removes the spiderfied state from the map by removing the spiderfied markers and restoring the opacity of the cluster markers.
   *
   * @returns void
   */
  unspiderfy() {
    this.map.eachLayer((layer: Layer & AnyProps) => {
      if (layer._spiderfied) {
        layer.remove();
        delete layer._spiderfied;
      }

      // restore cluster opacity
      if (this.layerMatchesCluster(layer, this.cluster)) {
        const clusterMarker = layer as Marker;
        if (clusterMarker.setOpacity) {
          clusterMarker.setOpacity(1);
        }
      }
    });

    this.cluster = null;
  }

  /**
   * Checks if a layer matches a cluster based on their IDs.
   *
   * @param layer - The layer to be checked.
   * @param cluster - The cluster to be compared with.
   * @returns True if the layer matches the cluster, false otherwise.
   */
  private layerMatchesCluster(layer: Layer, cluster: (PropertyGeo & ClusterGeo) | null): boolean {
    if (!layer || !cluster) {
      return false;
    }
    const geojsonObj = (layer as Marker)?.feature;
    const id = geojsonObj ? getClusterId(geojsonObj) : null;
    const targetId = getClusterId(cluster);
    return id !== null && id !== undefined && id === targetId;
  }

  /**
   * Generates an array of LeafletPoint objects representing the positions of the cluster points on the map in a circular pattern.
   *
   * @param count - The number of cluster points.
   * @param center - The center LeafletPoint of the cluster.
   * @returns An array of LeafletPoint objects representing the positions of the cluster points on the map.
   */
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

  /**
   * Generates an array of LeafletPoint objects representing the positions of the cluster points on the map in a spiral pattern.
   *
   * @param count - The number of cluster points.
   * @param center - The center LeafletPoint of the cluster.
   * @returns An array of LeafletPoint objects representing the positions of the cluster points on the map.
   */
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
