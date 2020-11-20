Leaflet Draw example:

```js
import 'leaflet/dist/leaflet.css';
import '../Map.scss';
import 'leaflet';
import { TileLayer, Map as MapContainer } from 'react-leaflet';

<MapContainer center={[48.423078, -123.360956]} zoom={18}>
  <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <LeafletDraw
    canAdd
    readonly={false}
    onChange={console.log}
    onCreate={console.log}
    value={{
      type: 'FeatureCollection',
      features: [
        {
          id: 0,
          type: 'Feature',
          properties: {
            name: 'Coors Field',
            amenity: 'Baseball Stadium',
            popupContent: 'This is where the Rockies play!',
            editable: true,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-123.360956, 48.423078],
                [-123.360388, 48.423007],
                [-123.360452, 48.422747],
                [-123.360799, 48.422619],
                [-123.361019, 48.422643],
                [-123.360956, 48.423078],
              ],
            ],
          },
        },
      ],
    }}
  />
</MapContainer>;
```
