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

        {/* This is your existing photo upload component. It remains untouched. */}
        <UploadComponent eventId={eventId} />

        {/* --- NEW VIDEO UPLOAD SECTION ---
          This is the new section we are adding for videos.
          It's separate from your photo component to ensure nothing breaks.
        */}
        <div className="video-upload-box">
          <h2>Got a Video to Share?</h2>
          <p>To share videos, please use our dedicated Dropbox link below. This will open in a new tab.</p>
          
          {/* This is a link styled like a button.
            - href: Your secure Dropbox File Request link.
            - target="_blank": Opens the link in a new browser tab.
            - rel="noopener noreferrer": A security best practice for new tabs.
            - className="schedule-link": I've used the same class as your other buttons to keep the style consistent.
          */}
          <a 
            href="https://www.dropbox.com/request/9i0q7EVXPBcof15d4bhG" 
            target="_blank" 
            rel="noopener noreferrer"
            className="schedule-link"
          >
            Upload Video to Dropbox
          </a>
        </div>
      </main>
    </div>
  );
}

// We export the component so it can be used in App.jsx
export default GuestUploadPage;
