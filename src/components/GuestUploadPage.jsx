// src/components/GuestUploadPage.jsx

// We need to import 'Link' to allow navigation to other pages.
import { Link } from 'react-router-dom';

// We also import the component that handles the photo uploads.
import UploadComponent from './UploadComponent';

/**
 * This is the main page that wedding guests will see.
 * It displays the wedding title, navigation links, and the photo upload tool.
 */
function GuestUploadPage() {
  // For simplicity, we've set a specific event ID for this wedding.
  const eventId = "maries-wedding-2025";

  // --- STYLING OBJECTS ---
  // I've added the styles directly here to make the changes safe and self-contained.
  const uploadContainerStyle = {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '2rem auto', // Centers the box and adds space
    textAlign: 'center'
  };

  const separatorStyle = {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#aaa',
    margin: '2rem 0'
  };

  const lineStyle = {
    flexGrow: 1,
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '0 1rem'
  };

  return (
    // This "App" class is the main container for the page.
    <div className="App">
      <header className="App-header">
        <h1>Marie & Christopher</h1>
      </header>

      <main>
        {/* This container holds our new navigation buttons. */}
        <div className="nav-links">
          <Link to="/schedule" className="schedule-link">
            View Schedule
          </Link>
          <Link to="/menu" className="schedule-link">
            View Menu
          </Link>
          {/* This link will now go to the clean seating plan URL. */}
          <Link to="/seatingplan" className="schedule-link">
            Seating Plan
          </Link>
        </div>

        {/* --- NEW UNIFIED UPLOAD CONTAINER --- 
            I've wrapped both the photo and video sections in this single styled container.
            This makes them feel like part of the same component.
        */}
        <div style={uploadContainerStyle}>

          {/* This is your existing photo upload component. It remains untouched. */}
          {/* I have updated the title in the UploadComponent to be more specific */}
          <UploadComponent eventId={eventId} title="Upload a Photo" />

          {/* --- VISUAL SEPARATOR --- 
              This creates a clean "OR" line between the two options.
          */}
          <div style={separatorStyle}>
            <hr style={lineStyle} />
            <span>OR</span>
            <hr style={lineStyle} />
          </div>

          {/* --- VIDEO UPLOAD SECTION ---
              This is now styled to look consistent with the photo uploader above.
          */}
          <div>
            <h2>Share a Video</h2>
            <p style={{ margin: '1rem 0 1.5rem 0', color: '#555' }}>
              To share videos from the day, please use our dedicated Dropbox link.
            </p>
            
            <a 
              href="https://www.dropbox.com/request/9i0q7EVXPBcof15d4bhG" 
              target="_blank" 
              rel="noopener noreferrer"
              className="schedule-link" // Using your existing button class for consistency
            >
              Upload Video via Dropbox
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}

// We export the component so it can be used in App.jsx
export default GuestUploadPage;

