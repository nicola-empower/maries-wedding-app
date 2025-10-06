// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../firebase';
import { collection, query, orderBy, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './AdminDashboard.css'; // Make sure you have this CSS file

function AdminDashboard() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  // Changed state to hold the full media object, not just a URL
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Using onSnapshot for real-time updates (from my suggestion)
  useEffect(() => {
    const q = query(collection(firestore, 'uploads'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const uploadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUploads(uploadsData);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);
  
  // Your original handleDelete function (it's perfect)
  const handleDelete = async (upload) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        // 1. Delete the file from Firebase Storage
        const fileRef = ref(storage, upload.fileUrl);
        await deleteObject(fileRef);

        // 2. Delete the document from Firestore
        await deleteDoc(doc(firestore, 'uploads', upload.id));

        // 3. No need to update state manually, onSnapshot will do it automatically!
      } catch (error) {
        console.error("Error removing document or file: ", error);
        alert("Failed to delete. Please try again.");
      }
    }
  };

  if (loading) {
    return <p className="loading-message">Loading media...</p>;
  }

  return (
    <>
      <div className="admin-dashboard-container">
        <header className="admin-header">
          <h1>Hello, Mrs. Cochrane!</h1>
          <div className="admin-actions">
            <Link to="/thankyoulist" className="link-button">
              Thank You List
            </Link>
            <button onClick={() => signOut(auth)} className="logout-button">Logout</button>
          </div>
        </header>
        <div className="gallery-grid">
          {uploads.map(upload => (
            <div key={upload.id} className="admin-card">
              
              {/* --- 1. THE VIDEO FIX FOR THE GALLERY --- */}
              <div className="media-container" onClick={() => setSelectedMedia(upload)}>
                {upload.fileType.startsWith('video') ? (
                  <video src={upload.fileUrl} className="media-preview" />
                ) : (
                  <img src={upload.fileUrl} alt={upload.guestName || 'Guest upload'} className="media-preview" />
                )}
              </div>

              <div className="card-info">
                <div className="guest-details">
                    <p><strong>{upload.guestName || 'Anonymous'}</strong></p>
                    {upload.message && <p>"{upload.message}"</p>}
                </div>
                <div className="button-group">
                  <a href={upload.fileUrl} download className="download-button" onClick={(e) => e.stopPropagation()}>
                    Download
                  </a>
                  {/* Added a delete button to use your handleDelete function */}
                  <button onClick={() => handleDelete(upload)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- 2. THE VIDEO FIX FOR THE LIGHTBOX --- */}
      {selectedMedia && (
        <div className="lightbox" onClick={() => setSelectedMedia(null)}>
          <button className="close-button">&times;</button>
          {selectedMedia.fileType.startsWith('video') ? (
            <video src={selectedMedia.fileUrl} controls autoPlay className="lightbox-media" onClick={(e) => e.stopPropagation()} />
          ) : (
            <img src={selectedMedia.fileUrl} alt="Full size view" className="lightbox-media" onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}
    </>
  );
}

export default AdminDashboard;