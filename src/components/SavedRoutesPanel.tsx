import React, { useState } from 'react';
import { TravelRoute } from '../services/TravelRecommendationService';
import { Heart, Trash2, Star, Clock, MapPin } from 'lucide-react';

interface SavedRoutesPanelProps {
  routes: TravelRoute[];
  darkMode: boolean;
  onSelectRoute: (route: TravelRoute) => void;
  onFavoriteToggle: (id: string) => void;
  onDeleteRoute: (id: string) => void;
}

const SavedRoutesPanel: React.FC<SavedRoutesPanelProps> = ({
  routes,
  darkMode,
  onSelectRoute,
  onFavoriteToggle,
  onDeleteRoute
}) => {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredRoutes = routes.filter(route => {
    if (filter === 'favorites') return route.favorite;
    if (filter === 'morning') return route.timeOfDay === 'Morning';
    if (filter === 'evening') return route.timeOfDay === 'Evening' || route.timeOfDay === 'Night';
    return true;
  });

  const getTimeClass = (timeOfDay: string) => {
    switch(timeOfDay) {
      case 'Morning': return 'text-yellow-600 bg-yellow-100';
      case 'Afternoon': return 'text-orange-600 bg-orange-100';
      case 'Evening': return 'text-blue-600 bg-blue-100';
      case 'Night': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTimeDarkClass = (timeOfDay: string) => {
    switch(timeOfDay) {
      case 'Morning': return 'text-yellow-300 bg-yellow-900/30';
      case 'Afternoon': return 'text-orange-300 bg-orange-900/30';
      case 'Evening': return 'text-blue-300 bg-blue-900/30';
      case 'Night': return 'text-indigo-300 bg-indigo-900/30';
      default: return 'text-gray-300 bg-gray-800';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Saved Safe Routes</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === 'all' 
                ? (darkMode ? 'bg-pink-900 text-pink-100' : 'bg-pink-100 text-pink-700') 
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === 'favorites' 
                ? (darkMode ? 'bg-pink-900 text-pink-100' : 'bg-pink-100 text-pink-700') 
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setFilter('morning')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === 'morning' 
                ? (darkMode ? 'bg-pink-900 text-pink-100' : 'bg-pink-100 text-pink-700') 
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
            }`}
          >
            Morning
          </button>
          <button
            onClick={() => setFilter('evening')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === 'evening' 
                ? (darkMode ? 'bg-pink-900 text-pink-100' : 'bg-pink-100 text-pink-700') 
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
            }`}
          >
            Evening
          </button>
        </div>
      </div>

      {filteredRoutes.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No routes found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRoutes.map((route) => (
            <div 
              key={route.id}
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} 
                p-3 rounded-lg transition-all duration-200 cursor-pointer`}
              onClick={() => onSelectRoute(route)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{route.name}</h3>
                    {route.favorite && (
                      <Star className={`ml-2 h-4 w-4 ${darkMode ? 'text-yellow-300' : 'text-yellow-500'} fill-current`} />
                    )}
                    <span 
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        darkMode ? getTimeDarkClass(route.timeOfDay) : getTimeClass(route.timeOfDay)
                      }`}
                    >
                      {route.timeOfDay}
                    </span>
                  </div>
                  <div className="mt-1 text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <div className="flex-1 truncate">
                      <span className="opacity-70">From:</span> {route.from}
                    </div>
                  </div>
                  <div className="mt-1 text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <div className="flex-1 truncate">
                      <span className="opacity-70">To:</span> {route.to}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`px-2 py-1 rounded-md ${
                    darkMode 
                      ? route.safetyScore > 7 ? 'bg-green-900/40 text-green-300' : 'bg-yellow-900/40 text-yellow-300'
                      : route.safetyScore > 7 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Safety: {route.safetyScore}/10
                  </div>
                  <div className="mt-2 text-xs opacity-70">
                    {route.lightingCondition}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs opacity-70 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(route.created).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavoriteToggle(route.id);
                    }}
                    className={`p-1 rounded-full ${
                      darkMode 
                        ? 'hover:bg-gray-600' 
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        route.favorite 
                          ? 'text-pink-500 fill-current' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRoute(route.id);
                    }}
                    className={`p-1 rounded-full ${
                      darkMode 
                        ? 'hover:bg-red-900/30 text-red-300' 
                        : 'hover:bg-red-100 text-red-500'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRoutesPanel;