// src/thankyoulist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';

interface Guest {
  id: string;
  name: string;
  table_number: number;
  thank_you_sent: boolean;
  gift_note: string;
}

// Your Firebase configuration object.
// We're putting it directly in this file to avoid import issues.
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialise Firebase directly in this file
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function ThankYouList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        await fetchGuests();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'guestlist'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      const guestList: Guest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        guestList.push({
          id: doc.id,
          name: data.name,
          table_number: data.table_number,
          thank_you_sent: data.thank_you_sent || false,
          gift_note: data.gift_note || '',
        });
      });
      setGuests(guestList);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (guestId: string, field: 'thank_you_sent' | 'gift_note', value: any) => {
    try {
      const guestDocRef = doc(db, 'guestlist', guestId);
      await updateDoc(guestDocRef, { [field]: value });
      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest.id === guestId ? { ...guest, [field]: value } : guest
        )
      );
    } catch (error) {
      console.error('Error updating guest:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 text-purple-950">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-950 mb-8">
          Wedding Thank You List
        </h1>
        {guests.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No guests found. Time to relax!</p>
        ) : (
          <div className="space-y-6">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 hover:shadow-md"
              >
                <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                  <h2 className="text-lg font-semibold text-purple-950 truncate">
                    {guest.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Table: {guest.table_number}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-4 w-full sm:w-auto">
                  <input
                    type="text"
                    value={guest.gift_note}
                    onChange={(e) =>
                      handleUpdate(guest.id, 'gift_note', e.target.value)
                    }
                    placeholder="Add gift note..."
                    className="p-2 border border-gray-300 rounded-md text-sm w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() =>
                      handleUpdate(
                        guest.id,
                        'thank_you_sent',
                        !guest.thank_you_sent
                      )
                    }
                    className={`
                      px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200
                      ${
                        guest.thank_you_sent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }
                    `}
                  >
                    {guest.thank_you_sent ? 'Sent' : 'Mark Sent'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}