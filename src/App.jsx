// src/App.jsx

// Import necessary components and styles.
// Routes and Route are for handling navigation between pages.
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import the different page components of your application.
import GuestUploadPage from './components/GuestUploadPage.jsx';
import AdminPage from './components/AdminPage.jsx';
import SchedulePage from './components/SchedulePage.jsx';

/**
 * The main App component that sets up the page routing for the website.
 */
function App() {
  return (
    // The <Routes> component acts as a container for all the individual page routes.
    <Routes>
      {/* This rule tells the app to show your GuestUploadPage 
        when someone visits the main website address ("/"). 
      */}
      <Route path="/" element={<GuestUploadPage />} />
      
      {/* This rule tells the app to show the AdminPage 
        when someone visits the special "/admin" address. 
      */}
      <Route path="/admin" element={<AdminPage />} />
      
      {/* This is the new rule for the schedule page. It will show 
        the SchedulePage component when someone visits "/schedule".
      */}
      <Route path="/schedule" element={<SchedulePage />} />
    </Routes>
  );
}

// Export the App component so it can be used by the rest of your application.
export default App;
