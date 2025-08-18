// src/components/UploadComponent.jsx
import { useState } from 'react';
import { storage, firestore } from '../firebase'; // Import the Firebase config
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function UploadComponent({ eventId }) { // We'll pass in an eventId to keep uploads organised
  const [file, setFile] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // A local state to show a preview of the selected file
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a temporary URL for the file preview
      setPreviewUrl(URL.createObjectURL(selectedFile));
      // Clear any previous status messages
      setStatus('');
    }
  };

  const handleUpload = async () => {
    // Check if a file has been selected before proceeding
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }
    // Set states to indicate the upload process has started
    setIsUploading(true);
    setStatus('Uploading...');

    try {
      // Step 1: Create a reference and upload the file to Firebase Storage
      // We use a unique timestamp to prevent file name collisions
      const storageRef = ref(storage, `uploads/${eventId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);

      // Step 2: Get the public URL of the file we just uploaded
      const fileUrl = await getDownloadURL(storageRef);

      // Step 3: Save a new record in the Firestore database with the file info
      await addDoc(collection(firestore, 'uploads'), {
        fileUrl,
        fileType: file.type, // This is crucial for distinguishing between photos and videos
        guestName: guestName.trim() || 'Anonymous',
        message: message.trim() || '',
        timestamp: serverTimestamp(),
        eventId: eventId,
        approved: true, // For now, all uploads are auto-approved
      });

      // Step 4: Reset the form and show a success message
      setStatus('✅ Upload successful! Thank you for sharing.');
      setFile(null); // Clear the file input state
      setPreviewUrl(null); // Clear the preview
      setGuestName(''); // Clear the name input
      setMessage(''); // Clear the message input

    } catch (err) {
      // Log any errors to the console and update the status
      console.error("Upload failed:", err);
      setStatus('❌ Oh no, the upload failed. Please try again.');
    } finally {
      // Ensure the uploading state is reset, regardless of success or failure
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📸 Upload Your Memory</h2>
      <p>Share a photo or video from the day for the happy couple!</p>
      
      {/* File input that accepts images and videos */}
      {previewUrl ? (
        // Show a preview if a file is selected
        file.type.startsWith('video') ? (
          <video src={previewUrl} style={{ maxWidth: '100%', maxHeight: '300px' }} controls />
        ) : (
          <img src={previewUrl} alt="File preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        )
      ) : (
        // Show the file input
        <input 
          type="file" 
          accept="image/*,video/*" 
          onChange={handleFileChange} 
        />
      )}
      
      {/* Optional guest name input */}
      <input 
        type="text" 
        placeholder="Your name (optional)" 
        value={guestName} 
        onChange={e => setGuestName(e.target.value)} 
      />
      
      {/* Optional message input */}
      <input 
        type="text" 
        placeholder="Add a message (optional)" 
        value={message} 
        onChange={e => setMessage(e.target.value)} 
      />
      
      {/* Upload button with a nice loading state */}
      <button 
        onClick={handleUpload} 
        disabled={isUploading || !file}
      >
        {isUploading ? 'Uploading...' : 'Upload Photo'}
      </button>
      
      {/* Status message display */}
      {status && (
        <p>{status}</p>
      )}
    </div>
  );
}

export default UploadComponent;
