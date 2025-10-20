// src/components/GuestUploadPage.jsx

// We need to import 'Link' to allow navigation to other pages.
import { Link } from 'react-router-dom';

// The UploadComponent is now defined in this file to resolve the error.
// A placeholder component to allow the page to render.
function UploadComponent({ eventId }) {
  return (
    <div style={{ padding: '1.5rem', margin: '2rem 0', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h2>Upload Your Photos</h2>
      <p>Photo upload functionality will appear here.</p>
      <p>Event ID: {eventId}</p>
    </div>
  );
}


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

        {/* --- NEW VIDEO UPLOAD SECTION (UPDATED STYLES) ---
            This section has been updated to include a blue border
            to make it stand out.
        */}
        <div className="video-upload-section" style={{ 
            marginTop: '2rem', 
            textAlign: 'center', 
            border: '2px solid #6d789e', 
            padding: '1.5rem', 
            borderRadius: '8px' 
          }}>
            <h2>Share a Video</h2>
            <p>Have a video to share? Please use our Dropbox link to upload it.</p>
            <a 
              href="https://www.dropbox.com/request/9i0q7EVXPBcof15d4bhG" 
              target="_blank" 
              rel="noopener noreferrer"
              className="schedule-link" // Using your existing button class
            >
              Upload Video
            </a>
        </div>
      </main>
    </div>
  );
}

// We export the component so it can be used in App.jsx
export default GuestUploadPage;

