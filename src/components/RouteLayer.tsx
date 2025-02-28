// Create new file: src/components/RouteLayer.tsx
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import * as polyline from '@mapbox/polyline';

interface RouteLayerProps {
  from: string;
  to: string;
  darkMode: boolean;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ from, to, darkMode }) => {
  const map = useMap();
  const [route, setRoute] = useState<L.Polyline | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // Use Nominatim to geocode addresses
        const fromRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(from)}`);
        const toRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(to)}`);
        
        const [fromData, toData] = await Promise.all([fromRes.json(), toRes.json()]);
        
        if (fromData[0] && toData[0]) {
          const fromCoord = [fromData[0].lat, fromData[0].lon];
          const toCoord = [toData[0].lat, toData[0].lon];
          
          // Use OSRM for routing
          const routeRes = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${fromCoord[1]},${fromCoord[0]};${toCoord[1]},${toCoord[0]}?overview=full&geometries=polyline`
          );
          const routeData = await routeRes.json();
          
          if (route) {
            map.removeLayer(route);
          }
          const coordinates = polyline.decode(routeData.routes[0].geometry);
          const latLngs = coordinates.map(point => L.latLng(point[0], point[1]));
          
          const newRoute = L.polyline(
            latLngs,
            {
              color: darkMode ? '#ec4899' : '#db2777',
              weight: 5,
              opacity: 0.7
            }
          );
          
          newRoute.addTo(map);
          setRoute(newRoute);
          
          // Fit map to show the entire route
          map.fitBounds(newRoute.getBounds(), { padding: [50, 50] });
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();

    return () => {
      if (route) {
        map.removeLayer(route);
      }
    };
  }, [from, to, map, darkMode]);

  return null;
};

export default RouteLayer;