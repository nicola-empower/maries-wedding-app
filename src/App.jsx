// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GuestUploadPage from './components/GuestUploadPage.jsx';
import AdminPage from './components/AdminPage.jsx';

function App() {
  return (
    <Routes>
      {/* This rule tells the app to show your styled guest page 
          when someone visits the main website address (/). */}
      <Route path="/" element={<GuestUploadPage />} />
      
      {/* This rule tells the app to show the admin login/dashboard 
          when someone visits the special /admin address. */}
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;