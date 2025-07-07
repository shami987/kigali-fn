// AuthWatcher.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAppView } from '../features/laptops/laptopSlice';

const AuthWatcher = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // When user is not authenticated → force view to login
    if (!isAuthenticated) {
      dispatch(setAppView('login'));
    }
  }, [isAuthenticated, dispatch]);

  return null; // No UI
};

export default AuthWatcher;
