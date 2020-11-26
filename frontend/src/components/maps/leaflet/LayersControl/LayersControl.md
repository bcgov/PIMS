LayerControl example:

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

  <LayersControl />
</MapContainer>;
```
