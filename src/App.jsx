// src/App.jsx

// Import necessary components and styles.
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import the different page components of your application.
import GuestUploadPage from './components/GuestUploadPage.jsx';
import AdminPage from './components/AdminPage.jsx';
import SchedulePage from './components/SchedulePage.jsx';
import MenuPage from './components/MenuPage.jsx'; 
import SeatingPlanPage from './components/SeatingPlanPage.jsx';

/**
 * The main App component that sets up the page routing for the website.
 */
function App() {
  return (
    <Routes>
      {/* Main guest page */}
      <Route path="/" element={<GuestUploadPage />} />
      
      {/* Admin login/dashboard page */}
      <Route path="/admin" element={<AdminPage />} />
      
      {/* Schedule page */}
      <Route path="/schedule" element={<SchedulePage />} />
      
      {/* Menu page */}
      <Route path="/menu" element={<MenuPage />} />

      {/* The seating plan route is now a clean, simple path. */}
      <Route path="/seatingplan" element={<SeatingPlanPage />} />
    </Routes>
  );
}

// Export the App component so it can be used by the rest of your application.
export default App;
