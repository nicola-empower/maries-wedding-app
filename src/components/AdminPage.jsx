// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

function AdminDashboard() {
  const [uploads, setUploads] = useState([]);

  // This hook fetches the data from Firestore when the component loads
  useEffect(() => {
    const uploadsCollection = collection(firestore, 'uploads');
    const q = query(uploadsCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const uploadsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setUploads(uploadsData);
    });

    // Cleanup function to stop listening when we leave the page
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h1>Hello, Mrs. Cochrane!</h1>
        <div className="admin-actions">
          <button>Thank You List</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="gallery-grid">
        {uploads.map((upload) => (
          <div key={upload.id} className="admin-card">
            
            {/* --- THIS IS THE FIX --- */}
            {/* We check the fileType and use the correct HTML tag */}
            {upload.fileType.startsWith('video') ? (
              <video src={upload.fileUrl} controls className="media-preview" />
            ) : (
              <img src={upload.fileUrl} alt={upload.guestName || 'Uploaded media'} className="media-preview" />
            )}
            {/* --- END OF FIX --- */}

            <div className="card-info">
              <p className="guest-name">{upload.guestName || 'Anonymous'}</p>
              <a 
                href={upload.fileUrl} 
                download 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-button"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;