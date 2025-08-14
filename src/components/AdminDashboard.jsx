// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

function AdminDashboard() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // This code runs once when the component first loads
  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      // Create a query to get all documents from the 'uploads' collection, ordered by time
      const q = query(collection(firestore, 'uploads'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      const uploadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // This is the debugging line to check what data we get from Firebase
      console.log('Fetched data:', uploadsData);
      
      setUploads(uploadsData);
      setLoading(false);
    };

    fetchUploads();
  }, []); // The empty array [] means this effect runs only once

  if (loading) {
    return <p className="loading-message">Loading photos...</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => signOut(auth)} className="logout-button">Logout</button>
      </div>
      <div className="photo-grid">
        {uploads.map(upload => (
          <div key={upload.id} className="photo-card">
            <img src={upload.fileUrl} alt={upload.guestName || 'Guest upload'} />
            <div className="photo-info">
              <p><strong>{upload.guestName || 'Anonymous'}</strong></p>
              {upload.message && <p>"{upload.message}"</p>}
              
              {/* The download button we added */}
              <a 
                href={upload.fileUrl} 
                download 
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