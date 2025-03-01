import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SaveRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routeName: string, notes?: string) => void;
  darkMode: boolean;
  fromAddress: string;
  toAddress: string;
}

const SaveRouteModal: React.FC<SaveRouteModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  darkMode,
  fromAddress,
  toAddress
}) => {
  const [routeName, setRouteName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full shadow-2xl`}>
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Save Safe Route</h2>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              From
            </label>
            <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {fromAddress}
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              To
            </label>
            <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {toAddress}
            </div>
          </div>
          
          <div>
            <label htmlFor="routeName" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Route Name*
            </label>
            <input
              type="text"
              id="routeName"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Home to Work"
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
              required
            />
          </div>
          
          <div>
            <label htmlFor="notes" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this route (e.g., well-lit, avoid at night)"
              rows={3}
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (routeName.trim()) {
                  onSave(routeName.trim(), notes.trim() || undefined);
                  setRouteName('');
                  setNotes('');
                }
              }}
              disabled={!routeName.trim()}
              className={`px-4 py-2 rounded-md ${
                routeName.trim() 
                  ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                  : 'bg-pink-400 cursor-not-allowed text-white'
              }`}
            >
              Save Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveRouteModal;
