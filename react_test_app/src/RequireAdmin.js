import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAdmin;
