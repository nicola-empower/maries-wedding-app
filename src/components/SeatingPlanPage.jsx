// src/components/SeatingPlanPage.jsx

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

// Global variables provided by the Canvas environment
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/**
 * SeatingPlanPage component for guests to look up their seating arrangement.
 */
const SeatingPlanPage = () => {
  const [db, setDb] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [seatingInfo, setSeatingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Effect to initialize Firebase Firestore once on component mount
  useEffect(() => {
    const initFirebase = () => {
      try {
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        setDb(firestoreDb);
        setIsAuthReady(true);
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    };
    initFirebase();
  }, [firebaseConfig]);

  // Function to handle the seating plan search
  const searchSeating = async () => {
    if (!guestName.trim()) {
      setMessage('Please enter a name to search.');
      return;
    }

    setLoading(true);
    setSeatingInfo(null);
    setMessage('');

    try {
      if (!isAuthReady || !db) {
        setMessage('Firebase is not initialized. Please try again.');
        setLoading(false);
        return;
      }

      // Query the 'seatingPlan' collection in Firestore
      const q = collection(db, `artifacts/${appId}/public/data/seatingPlan`);
      const querySnapshot = await getDocs(q);
      
      let found = false;
      querySnapshot.forEach(doc => {
        const tableData = doc.data();
        const tableGuests = tableData.guests.map(name => name.toLowerCase());
        
        // Check if the guest's name exists in the list of guests for a table
        if (tableGuests.includes(guestName.trim().toLowerCase())) {
          setSeatingInfo({
            tableName: tableData.tableName,
            guests: tableData.guests
          });
          found = true;
        }
      });

      if (!found) {
        setMessage('Sorry, we couldn\'t find that name. Please check the spelling and try again.');
      }

    } catch (error) {
      console.error("Error searching seating plan:", error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Simple modal component for displaying messages
  const MessageModal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 shadow-xl text-center max-w-sm w-full">
        <p className="text-gray-800 text-lg">{message}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200">
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Find Your Seat</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Enter your name to find your table and who you're sitting with.
      </p>

      {/* This container has the same styling as the upload component's box */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter your full name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />
        </div>

        <button
          onClick={searchSeating}
          disabled={loading}
          className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-emerald-600 transition duration-200 disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Find My Seat'}
        </button>
      </div>

      {seatingInfo && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">You're at Table: {seatingInfo.tableName}</h2>
          <p className="text-gray-600 mb-2">You're sitting with:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {seatingInfo.guests.map((guest, index) => (
              <li key={index} className="text-base">{guest}</li>
            ))}
          </ul>
        </div>
      )}

      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </div>
  );
};

export default SeatingPlanPage;

/*
--- Firestore Data Structure ---

To make this seating plan work, you'll need to create a new collection in your Firestore database.
The collection path must be: artifacts/{your_app_id}/public/data/seatingPlan

Each document in this collection should represent a single table. The document ID can be anything, but the data inside must follow this structure exactly:

Collection: artifacts/{your_app_id}/public/data/seatingPlan
Document ID: (e.g., table-one, table-two, etc.)
Document Data:

{
  "tableName": "One",
  "guests": [
    "John Smith",
    "Jane Doe",
    "Peter Jones"
  ]
}

{
  "tableName": "Two",
  "guests": [
    "Sarah Brown",
    "David Williams",
    "Emily Johnson"
  ]
}

Make sure to use the exact table names you need (e.g., "One", "Two", "Three") as text strings, not numbers.
The search is case-insensitive, so "John Smith" and "john smith" will both work.
*/
