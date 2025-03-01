import React from "react";
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Circle, InfoWindow } from '@react-google-maps/api';
import { AlertTriangle, Plus, Search, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IncidentReport {
  id: number;
  location: google.maps.LatLngLiteral;
  type: string;
  description: string;
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCTncgg-x65QicwCIqyGJYopp45dMBh74Y";
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates
const DEFAULT_ZOOM = 13;

const DangerZones = () => {
  const [darkMode] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [newReport, setNewReport] = useState({
    type: '',
    description: '',
    severity: 'medium' as 'high' | 'medium' | 'low'
  });
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    fetch('https://run.mocky.io/v3/ff30edce-b38e-41ed-b139-af765ae6c161')
      .then(response => response.json())
      .then(data => {
        const fetchedIncidents = data.map((incident: any) => ({
          ...incident,
          timestamp: new Date(incident.timestamp)
        }));
        setIncidents(fetchedIncidents);
      })
      .catch(error => console.error('Error fetching incidents:', error));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#ef4444';
    }
  };

  const handleSubmitReport = () => {
    if (!newReport.type || !newReport.description) {
      alert('Please fill all required fields');
      return;
    }

    const newIncident: IncidentReport = {
      id: incidents.length + 1,
      location: currentLocation || DEFAULT_CENTER, // Use current location if available
      type: newReport.type,
      description: newReport.description,
      timestamp: new Date(),
      severity: newReport.severity
    };

    setIncidents([...incidents, newIncident]);
    setShowReportForm(false);
    setNewReport({ type: '', description: '', severity: 'medium' });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link to="/dashboard" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
            Danger Zones
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 ml-4">
            View and report unsafe areas to help keep our community safe
          </p>
        </div>

{/* Main Content */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Map Section */}
  <div className="lg:col-span-2">
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
      <div className="h-[600px]">
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={currentLocation || DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
          >
            {currentLocation && (
              <>
                <Circle
                  center={currentLocation}
                  radius={100}
                  options={{
                    strokeColor: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.5
                  }}
                />
                <InfoWindow position={currentLocation}>
                  <div className="p-2">
                    <h3 className="font-medium">Your Location</h3>
                  </div>
                </InfoWindow>
              </>
            )}
            {incidents.map((incident) => (
              <React.Fragment key={incident.id}>
                <Circle
                  center={incident.location}
                  radius={500}
                  options={{
                    strokeColor: getSeverityColor(incident.severity),
                    fillColor: getSeverityColor(incident.severity),
                    fillOpacity: 0.3
                  }}
                />
                <InfoWindow position={incident.location}>
                  <div className="p-2">
                    <h3 className="font-medium">{incident.type}</h3>
                    <p className="text-sm text-gray-600">{incident.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {incident.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </InfoWindow>
              </React.Fragment>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  </div>
</div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-lg`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search areas..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  } border focus:ring-2 focus:ring-red-500`}
                />
              </div>
              
              <div className="mt-4">
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Reports
                </button>
              </div>
            </div>

            {/* Report Form */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-lg`}>
              {!showReportForm ? (
                <button
                  onClick={() => setShowReportForm(true)}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Report Unsafe Area
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium">Report Unsafe Area</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={newReport.type}
                      onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                      className={`w-full p-2 rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      } border`}
                    >
                      <option value="">Select type</option>
                      <option value="Harassment">Harassment</option>
                      <option value="Poor Lighting">Poor Lighting</option>
                      <option value="Suspicious Activity">Suspicious Activity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      className={`w-full p-2 rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      } border`}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Severity</label>
                    <select
                      value={newReport.severity}
                      onChange={(e) => setNewReport({ ...newReport, severity: e.target.value as 'high' | 'medium' | 'low' })}
                      className={`w-full p-2 rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      } border`}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSubmitReport}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Submit Report
                    </button>
                    <button
                      onClick={() => setShowReportForm(false)}
                      className={`py-2 px-4 ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      } rounded-lg`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Reports */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-lg`}>
              <h3 className="font-medium mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {incidents.slice().reverse().map((incident) => (
                  <div 
                    key={incident.id}
                    className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    } border-l-4`}
                    style={{ borderLeftColor: getSeverityColor(incident.severity) }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{incident.type}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {incident.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {incident.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>

  );
};

export default DangerZones;
