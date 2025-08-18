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
  const [isReady, setIsReady] = useState(false);
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
        setIsReady(true);
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
      if (!isReady || !db) {
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
    <div className="App">
      <header className="App-header">
        <h1>Marie & Christopher</h1>
      </header>

      <main>
        {/* This container uses the same class as the photo upload one for consistent styling */}
        <div className="upload-container">
          <h2>Find Your Seat</h2>
          <p>Enter your name to find your table and who you're sitting with.</p>

          <input
            type="text"
            placeholder="Enter your full name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <button onClick={searchSeating} disabled={loading || !isReady}>
            {loading ? 'Searching...' : 'Find My Seat'}
          </button>

          {seatingInfo && (
            <div className="seating-info">
              <h3>You're at Table: {seatingInfo.tableName}</h3>
              <p>You're sitting with:</p>
              <ul>
                {seatingInfo.guests.map((guest, index) => (
                  <li key={index}>{guest}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </div>
  );
};

export default SeatingPlanPage;
