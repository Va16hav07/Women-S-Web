import { useState, useEffect } from 'react';


export interface Contact {
  id: number;
  name: string;
  phone: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (newContact: Omit<Contact, 'id'>) => {
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    setContacts([...contacts, { ...newContact, id: newId }]);
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  return {
    contacts,
    addContact,
    deleteContact
  };
};
