// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../firebase';
import { collection, query, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom'; // <-- NEW: Import Link from react-router-dom

function AdminDashboard() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // <-- NEW: State for the lightbox

  // ... (fetchUploads function remains the same) ...
  const fetchUploads = async () => {
    const q = query(collection(firestore, 'uploads'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const uploadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUploads(uploadsData);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchUploads();
  }, []);

  if (loading) {
    return <p className="loading-message">Loading photos...</p>;
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-links">
            {/* <-- NEW: Link to the thank-you list page --> */}
            <Link to="/thankyoulist" className="link-button">
              Thank You List
            </Link>
            <button onClick={() => signOut(auth)} className="logout-button">Logout</button>
          </div>
        </div>
        <div className="photo-grid">
          {uploads.map(upload => (
            // NEW: Added onClick handler to each card
            <div key={upload.id} className="photo-card" onClick={() => setSelectedImage(upload.fileUrl)}>
              <img src={upload.fileUrl} alt={upload.guestName || 'Guest upload'} />
              <div className="photo-info">
                <p><strong>{upload.guestName || 'Anonymous'}</strong></p>
                {upload.message && <p>"{upload.message}"</p>}
                <div className="button-group">
                  <a href={upload.fileUrl} download className="download-button" onClick={(e) => e.stopPropagation()}>
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: This is the lightbox/modal. It only appears if selectedImage is not null. */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <button className="close-button">&times;</button>
          <img src={selectedImage} alt="Full size view" className="lightbox-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

export default AdminDashboard;