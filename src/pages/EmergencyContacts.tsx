import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useContacts } from '../hooks/useContacts';
import ContactsList from '../components/ContactsList';

const EmergencyContacts = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { contacts, addContact, deleteContact } = useContacts();

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Shield className={`h-8 w-8 mr-3 ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
          <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        </div>

        <ContactsList
          contacts={contacts}
          onAdd={addContact}
          onDelete={deleteContact}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default EmergencyContacts;
