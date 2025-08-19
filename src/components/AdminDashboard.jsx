// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../firebase';
import { collection, query, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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
  
  const handleDelete = async (uploadId, fileUrl) => {
    // Confirm with the user before deleting
    if (window.confirm("Are you sure you want to delete this photo?")) {
      try {
        // 1. Delete the file from Firebase Storage
        const imageRef = ref(storage, fileUrl);
        await deleteObject(imageRef);

        // 2. Delete the document from Firestore
        await deleteDoc(doc(firestore, 'uploads', uploadId));

        // 3. Update the state to remove the photo from the UI
        setUploads(uploads.filter(upload => upload.id !== uploadId));
      } catch (error) {
        console.error("Error removing document or image: ", error);
        alert("Failed to delete the photo. Please try again.");
      }
    }
  };
  if (loading) {
    return <p className="loading-message">Loading photos...</p>;
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Hello, Mrs. Cochrane!</h1>
          <div className="admin-links">
            <Link to="/thankyoulist" className="link-button">
              Thank You List
            </Link>
            <button onClick={() => signOut(auth)} className="logout-button">Logout</button>
          </div>
        </div>
        <div className="photo-grid">
          {uploads.map(upload => (
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
