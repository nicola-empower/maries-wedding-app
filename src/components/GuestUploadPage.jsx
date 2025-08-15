// src/components/GuestUploadPage.jsx

// We need to import 'Link' to allow navigation to other pages.
import { Link } from 'react-router-dom';

// We also import the component that handles the photo uploads.
import UploadComponent from './UploadComponent';

/**
 * This is the main page that wedding guests will see.
 * It displays the wedding title, a link to the schedule, and the photo upload tool.
 */
function GuestUploadPage() {
  // For simplicity, we've set a specific event ID for this wedding.
  // This ensures all photos are grouped together correctly.
  const eventId = "maries-wedding-2025";

  // The return statement contains all the JSX that will be displayed on the page.
  return (
    // This "App" class is the main container for the page, connecting to your CSS.
    <div className="App">
      <header className="App-header">
        <h1>Marie & Christopher</h1>
      </header>

      <main>
        {/* Here is the new, correctly placed link to the schedule.
          We've wrapped it in a <p> tag to give it its own space.
        */}
        <p>
          <Link to="/schedule" className="schedule-link">
            View the Wedding Schedule
          </Link>
        </p>

        {/* This is your existing photo upload component.
            We pass the eventId to it as a prop.
        */}
        <UploadComponent eventId={eventId} />
      </main>
    </div>
  );
}

// We export the component so it can be used in App.jsx
export default GuestUploadPage;
