declare module 'tiles-in-bbox' {
  interface ITile {
    x: number;
    y: number;
    z: number;
  }

  // get tiles in a bbox
  export function tilesInBbox(bounds: any, zoom: number): ITile[];
}
