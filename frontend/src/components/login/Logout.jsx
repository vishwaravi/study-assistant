import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session data
    sessionStorage.clear();

    // Optional: show a message (toast/snackbar) before redirect

    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return null; // or a loading spinner/message if you want
};

export default Logout;
