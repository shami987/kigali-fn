import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

// Import components
import HomePage from './components/HomePage';
import AddLaptopForm from './components/AddLaptopForm';
import DistributeLaptopForm from './components/DistributeLaptopForm';
import ReturnLaptopForm from './components/ReturnLaptopForm';
import LaptopList from './components/LaptopList';
import DistributedLaptopsList from './components/DistributedLaptopsList';
import LoginForm from './components/LoginForm';
import EditLaptopForm from './components/EditLaptopForm';
import RegisterForm from './components/RegisterForm';

import { setAppView } from './features/laptops/laptopSlice';
import { logout } from './features/auth/authSlice';

function App() {
  const appView = useSelector((state) => state.laptops.appView);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Global token validation
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!isAuthenticated || !token) {
      // Only redirect if not already on login/register pages
      if (appView !== 'login' && appView !== 'register') {
        if (!token) {
          toast.error('Please log in to continue.');
        }
        dispatch(logout()); // Clear auth state
        dispatch(setAppView('login'));
      }
    }
  }, [isAuthenticated, appView, dispatch]);

  let content;

  switch (appView) {
    case 'home':
      content = <HomePage />;
      break;
    case 'addLaptop':
      content = <AddLaptopForm />;
      break;
    case 'distributeLaptopForm':
      content = <DistributeLaptopForm />;
      break;
    case 'editLaptop':
      content = <EditLaptopForm />;
      break;
    case 'returnLaptop':
      content = <ReturnLaptopForm />;
      break;
    case 'listLaptops':
      content = <LaptopList />;
      break;
    case 'distributedLaptops':
      content = <DistributedLaptopsList />;
      break;
    case 'register':
      content = <RegisterForm />;
      break;
    case 'login':
      content = <LoginForm />;
      break;
    default:
      content = <HomePage />;
      break;
  }

  return (
    <div className="App">
      {content}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
