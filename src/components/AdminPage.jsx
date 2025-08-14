// src/components/AdminPage.jsx
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from './LoginPage.jsx';
import AdminDashboard from './AdminDashboard.jsx';

function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This useEffect hook listens for changes in the login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // This cleans up the listener when the component is removed
    return () => unsubscribe();
  }, []);

  // This new useEffect hook adds a special class to the body
  // ONLY when the login page is visible, allowing us to center it.
  useEffect(() => {
    if (!user) {
      document.body.classList.add('login-body');
    }
    // This is a "cleanup" function that removes the class when the
    // user logs in or navigates away.
    return () => {
      document.body.classList.remove('login-body');
    };
  }, [user]); // This effect re-runs whenever the 'user' state changes

  if (loading) {
    // You can replace this with a more stylish loading spinner later
    return <div className="loading-screen">Loading...</div>;
  }

  // If a user is logged in, show the Dashboard. If not, show the Login Page.
  return user ? <AdminDashboard /> : <LoginPage />;
}

export default AdminPage;