// src/components/UploadComponent.jsx
import { useState } from 'react';
import { storage, firestore } from '../firebase'; // We import the Firebase config we made earlier
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function UploadComponent({ eventId }) { // We'll pass in an eventId to keep uploads organised
  const [file, setFile] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
      <p>Share a photo from the day for the happy couple!</p>
      
      <input 
        type="file" 
        accept="image/*,video/*" 
        onChange={e => setFile(e.target.files[0])} 
      />
      
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