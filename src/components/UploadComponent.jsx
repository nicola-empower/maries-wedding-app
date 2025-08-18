// src/components/UploadComponent.jsx

import React, { useState } from 'react';
import { storage, firestore } from '../firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function UploadComponent({ eventId }) {
  const [file, setFile] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }
    setIsUploading(true);
    setStatus('Uploading...');

    try {
      // Step 1: Create a reference and upload the file to Firebase Storage
      const storageRef = ref(storage, `uploads/${eventId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);

      // Step 2: Get the URL of the file we just uploaded
      const fileUrl = await getDownloadURL(storageRef);

      // Step 3: Save a new record in the Firestore database with the file info
      await addDoc(collection(firestore, 'uploads'), {
        fileUrl,
        fileType: file.type,
        guestName: guestName.trim() || 'Anonymous',
        message: message.trim() || '',
        timestamp: serverTimestamp(),
        eventId: eventId,
        approved: true, // For now, all uploads are auto-approved
      });

      setStatus('✅ Upload successful! Thank you for sharing.');
      setFile(null); // Reset the form
      setPreviewUrl(null);
      setGuestName('');
      setMessage('');

    } catch (err) {
      console.error("Upload failed:", err);
      setStatus('❌ Oh no, the upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📸 Upload Your Memory</h2>
      <p>Share a photo or video from the day for the happy couple!</p>
      
      <input 
        type="file" 
        accept="image/*,video/*" 
        onChange={handleFileChange} 
      />
      
      {previewUrl && (
        file.type.startsWith('video') ? (
          <video src={previewUrl} style={{ maxWidth: '100%', maxHeight: '300px' }} controls />
        ) : (
          <img src={previewUrl} alt="File preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        )
      )}
      
      <input 
        type="text" 
        placeholder="Your name (optional)" 
        value={guestName} 
        onChange={e => setGuestName(e.target.value)} 
      />
      
      <input 
        type="text" 
        placeholder="Add a message (optional)" 
        value={message} 
        onChange={e => setMessage(e.target.value)} 
      />
      
      <button onClick={handleUpload} disabled={isUploading || !file}>
        {isUploading ? 'Uploading...' : 'Upload Photo'}
      </button>
      
      {status && <p>{status}</p>}
    </div>
  );
}

export default UploadComponent;
