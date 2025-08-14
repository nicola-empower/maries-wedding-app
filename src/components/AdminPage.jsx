// src/components/AdminPage.jsx
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from './LoginPage.jsx';
import AdminDashboard from './AdminDashboard.jsx';

function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      {user ? <AdminDashboard /> : <LoginPage />}
    </div>
  );
}

export default AdminPage;