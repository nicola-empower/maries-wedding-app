// src/components/UploadComponent.jsx

import React, { useState } from 'react';
import { storage, firestore } from '../firebase'; 
// 1. Import 'uploadBytesResumable' instead of 'uploadBytes'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function UploadComponent({ eventId }) {
  const [file, setFile] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  // 2. Add new state for upload progress
  const [progress, setProgress] = useState(0);

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
    setProgress(0);
    setStatus('Starting upload...');

    try {
      const storageRef = ref(storage, `uploads/${eventId}/${Date.now()}_${file.name}`);
      // 3. The main change: Use uploadBytesResumable for large files
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(currentProgress);
          setStatus(`Uploading: ${Math.round(currentProgress)}%`);
        }, 
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
          setStatus('❌ Oh no, the upload failed. Please try again.');
          setIsUploading(false);
        }, 
        async () => {
          // Handle successful uploads on complete
          setStatus('✅ Processing your upload...');
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(firestore, 'uploads'), {
            fileUrl,
            fileType: file.type,
            guestName: guestName.trim() || 'Anonymous',
            message: message.trim() || '',
            timestamp: serverTimestamp(),
            eventId: eventId,
            approved: true,
          });

          setStatus('✅ Upload successful! Thank you for sharing.');
          setFile(null);
          setPreviewUrl(null);
          setGuestName('');
          setMessage('');
          setIsUploading(false);
        }
      );

    } catch (err) {
      // This will catch errors in setting up the upload, not the upload itself
      console.error("Upload setup failed:", err);
      setStatus('❌ Oh no, something went wrong. Please try again.');
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
        disabled={isUploading} 
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
        disabled={isUploading} 
      />
      
      <input 
        type="text" 
        placeholder="Add a message (optional)" 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        disabled={isUploading} 
      />
      
      <button onClick={handleUpload} disabled={isUploading || !file}>
        {isUploading ? `Uploading... ${Math.round(progress)}%` : 'Upload Media'}
      </button>

      {/* 4. Show a progress bar during upload */}
      {isUploading && <progress value={progress} max="100" style={{ width: '100%', marginTop: '10px' }} />}
      
      {status && <p>{status}</p>}
    </div>
  );
}

export default UploadComponent;