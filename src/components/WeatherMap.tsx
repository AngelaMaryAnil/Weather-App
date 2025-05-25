import React, { useEffect, useState } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet marker icons in webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to update map view when coordinates change
const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
};

const WeatherMap: React.FC = () => {
  const { currentWeather, currentMapPosition } = useWeather();
  const [mapReady, setMapReady] = useState(false);

  // Leaflet needs to be loaded client-side
  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady || !currentWeather) {
    return null;
  }

  return (
    <div className="rounded-xl shadow-lg overflow-hidden h-72">
      <MapContainer 
        center={currentMapPosition} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView center={currentMapPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={currentMapPosition}>
          <Popup>
            {currentWeather.name}, {currentWeather.sys.country}
            <br />
            {currentWeather.weather[0].description}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;