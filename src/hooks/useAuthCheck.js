import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../features/auth/authSlice';
import { setAppView } from '../features/laptops/laptopSlice';

export const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('Token:', token);
    if (!token) {
      toast.error('Please log in to continue.');
      dispatch(logout());
      dispatch(setAppView('login'));
    }
  }, [dispatch]);
};
