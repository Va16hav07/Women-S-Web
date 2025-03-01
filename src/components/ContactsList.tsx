import { useState } from "react";
import { Phone, X, Plus, Send, Trash2, CheckCircle } from "lucide-react";
import { Contact } from "../hooks/useContacts";

interface ContactsListProps {
  contacts: Contact[]; // List of contacts
  onAdd: (contact: Omit<Contact, "id">) => void; // Function to add contact
  onDelete: (id: number) => void; // Function to delete contact
  darkMode?: boolean; // Dark mode toggle
}

const ContactsList = ({ contacts = [], onAdd, onDelete, darkMode = false }: ContactsListProps) => {
  const [showAddContact, setShowAddContact] = useState(false);
  const [alertSent, setAlertSent] = useState<number | null>(null);
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    phone: "",
  });

  const handleAdd = () => {
    if (newContact.name.trim() === "" || newContact.phone.trim() === "") {
      alert("Please enter both name and phone number");
      return;
    }

    onAdd(newContact);
    setNewContact({ name: "", phone: "" });
    setShowAddContact(false);
  };

  const sendAlert = (id: number) => {
    setAlertSent(id);
    setTimeout(() => setAlertSent(null), 3000);
  };

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl p-6`}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <Phone className={`h-5 w-5 mr-2 ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
          Emergency Contacts
        </h2>
        <button
          onClick={() => setShowAddContact(!showAddContact)}
          className={`${darkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600"} text-white p-2 rounded-full shadow-md transform transition-all duration-300 hover:scale-110`}
        >
          {showAddContact ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddContact && (
        <div className={`mb-6 p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-pink-50"} animate-fadeIn`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Contact Name"
              className={`w-full p-3 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-600" : "border-pink-200 bg-white"}`}
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className={`w-full p-3 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-600" : "border-pink-200 bg-white"}`}
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <button
              onClick={handleAdd}
              className={`px-6 py-2 col-span-2 ${darkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600"} text-white rounded-lg`}
            >
              Add Contact
            </button>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-center text-gray-500">No contacts added yet.</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id || Math.random()} // Ensure unique key
              className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {alertSent === contact.id ? (
                    <div className="flex items-center text-green-500 animate-pulse">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm">Alert sent!</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => sendAlert(contact.id)}
                        className={`p-2 rounded-lg ${darkMode ? "bg-pink-900/40 hover:bg-pink-800/60" : "bg-pink-100 hover:bg-pink-200"}`}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(contact.id)}
                        className={`p-2 rounded-lg ${darkMode ? "bg-red-900/40 hover:bg-red-800/60" : "bg-red-100 hover:bg-red-200"}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactsList;