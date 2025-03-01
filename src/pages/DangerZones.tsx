import { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { AlertTriangle, Plus, Search, Filter } from 'lucide-react';

interface IncidentReport {
  id: number;
  location: LatLngExpression;
  type: string;
  description: string;
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
}

const DangerZones = () => {
  const [darkMode] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [incidents, setIncidents] = useState<IncidentReport[]>([
    {
      id: 1,
      location: [28.6139, 77.2090],
      type: 'Harassment',
      description: 'Street harassment reported in this area',
      timestamp: new Date('2024-01-15'),
      severity: 'high'
    },
    {
      id: 2,
      location: [28.6229, 77.2190],
      type: 'Poor Lighting',
      description: 'Area lacks proper street lighting',
      timestamp: new Date('2024-01-14'),
      severity: 'medium'
    }
  ]);

  const [newReport, setNewReport] = useState({
    type: '',
    description: '',
    severity: 'medium' as 'high' | 'medium' | 'low'
  });

  const DEFAULT_CENTER: LatLngExpression = [28.6139, 77.2090]; // Delhi coordinates
  const DEFAULT_ZOOM = 13;

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
      location: DEFAULT_CENTER, // In a real app, you'd get the actual clicked location
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
            Danger Zones
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and report unsafe areas to help keep our community safe.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
              <div className="h-[600px]">
                <MapContainer
                  center={DEFAULT_CENTER}
                  zoom={DEFAULT_ZOOM}
                  className="w-full h-full"
                >
                  <TileLayer
                    url={darkMode 
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {incidents.map((incident) => (
                    <Circle
                      key={incident.id}
                      center={incident.location}
                      radius={500}
                      pathOptions={{
                        color: getSeverityColor(incident.severity),
                        fillColor: getSeverityColor(incident.severity),
                        fillOpacity: 0.3
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-medium">{incident.type}</h3>
                          <p className="text-sm text-gray-600">{incident.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {incident.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>
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
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
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
                  <input
                    type="text"
                    placeholder="Type (e.g., Harassment)"
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                  <textarea
                    placeholder="Description"
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                  />
                  <select
                    value={newReport.severity}
                    onChange={(e) => setNewReport({ ...newReport, severity: e.target.value as 'high' | 'medium' | 'low' })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button
                    onClick={handleSubmitReport}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Submit Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangerZones;