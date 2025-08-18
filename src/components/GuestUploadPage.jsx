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
          {/* ADD THIS NEW LINE FOR THE SEATING PLAN */}
          <Link to="/seatingplan" className="schedule-link">
            Seating Plan
          </Link>
        </div>

        {/* This is your existing photo upload component. */}
        <UploadComponent eventId={eventId} />
      </main>
    </div>
  );
}

// We export the component so it can be used in App.jsx
export default GuestUploadPage;
