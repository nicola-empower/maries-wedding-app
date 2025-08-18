// src/components/SeatingPlanPage.jsx

import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';

// We now import the Firebase services directly from your config file
import { firestore } from '../firebase'; 

/**
 * SeatingPlanPage component for guests to look up their seating arrangement.
 */
const SeatingPlanPage = () => {
  const [guestName, setGuestName] = useState('');
  const [seatingInfo, setSeatingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // We no longer need to manually initialize Firebase inside the component
  // We can just use the firestore instance we imported.

  // The app ID is also defined in your firebase.js file
  // but since we're using a specific Firestore path, we'll get it from the environment.
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;


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
      // Query the 'seatingPlan' collection using the imported firestore instance
      const q = collection(firestore, `artifacts/${appId}/public/data/seatingPlan`);
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

          <button onClick={searchSeating} disabled={loading}>
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
